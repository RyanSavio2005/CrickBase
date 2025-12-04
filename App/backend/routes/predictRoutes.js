const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

function zNormalize(values) {
  if (values.length === 0) return { mean: 0, std: 1 };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) * (b - mean), 0) / values.length;
  const std = Math.sqrt(variance) || 1;
  return { mean, std };
}

function scorePlayers(players, params) {
  const { format = 'ODI', pitch = 'balanced', strategy = 'balanced', locks = [], maxXI = 11 } = params;
  const runs = players.map(p => p.stats?.runs || 0);
  const wickets = players.map(p => p.stats?.wickets || 0);
  const matches = players.map(p => p.stats?.matches || 0);
  const averages = players.map(p => p.stats?.average || 0);
  const zr = zNormalize(runs), zw = zNormalize(wickets), zm = zNormalize(matches), za = zNormalize(averages);

  function z(val, zstats) { return (val - zstats.mean) / (zstats.std || 1); }
  function isRole(p, role) { return (p.role || '').toLowerCase().includes(role.toLowerCase()); }
  function hasTag(p, tag) { return (p.tags || []).some(t => (t || '').toLowerCase().includes(tag.toLowerCase())); }

  const scored = players.map(p => {
    const r = p.stats?.runs || 0;
    const w = p.stats?.wickets || 0;
    const m = p.stats?.matches || 0;
    const av = p.stats?.average || 0;

    let batScore = 0.6 * z(r, zr) + 0.3 * z(av, za) + 0.1 * z(m, zm);
    let bowlScore = 0.65 * z(w, zw) + 0.25 * z(1 / Math.max(1, av), za) + 0.1 * z(m, zm);
    let arScore = 0.5 * batScore + 0.5 * bowlScore;

    // Format tweaks
    if (format === 'T20') {
      batScore += 0.1 * z(r / Math.max(1, m), zr);
      bowlScore += 0.1 * z(w / Math.max(1, m), zw);
    } else if (format === 'Test') {
      batScore += 0.1 * z(av, za);
      bowlScore += 0.1 * z(m, zm);
    }

    // Pitch effects
    if (pitch === 'spin' && (hasTag(p, 'spin') || hasTag(p, 'spinner'))) bowlScore += 0.3;
    if (pitch === 'pace' && (hasTag(p, 'pace') || hasTag(p, 'seam'))) bowlScore += 0.3;
    if (pitch === 'flat') batScore += 0.2;

    let roleScore = 0;
    if (isRole(p, 'wicket-keeper')) {
      // Keepers judged by batting too
      roleScore = batScore + 0.2;
    } else if (isRole(p, 'batsman')) {
      roleScore = batScore;
    } else if (isRole(p, 'bowler')) {
      roleScore = bowlScore;
    } else {
      roleScore = arScore;
    }

    // Strategy
    if (strategy === 'bat-heavy') roleScore += 0.15 * batScore;
    if (strategy === 'bowl-heavy') roleScore += 0.15 * bowlScore;

    return { player: p, score: roleScore, batScore, bowlScore };
  });

  // Ensure one keeper
  const keepers = scored.filter(s => isRole(s.player, 'wicket-keeper')).sort((a, b) => b.score - a.score);

  // Sort overall
  scored.sort((a, b) => b.score - a.score);

  // Apply locks
  const lockSet = new Set((locks || []).map(String));
  const xi = [];
  const bench = [];

  // helper to count roles
  const counts = { bats: 0, bowls: 0, ar: 0, keepers: 0 };
  function roleAdd(p) {
    if (isRole(p, 'wicket-keeper')) counts.keepers++;
    else if (isRole(p, 'batsman')) counts.bats++;
    else if (isRole(p, 'bowler')) counts.bowls++;
    else counts.ar++;
  }

  // Include locked players first
  for (const s of scored) {
    if (xi.length >= maxXI) break;
    if (lockSet.has(String(s.player._id))) {
      xi.push(s);
      roleAdd(s.player);
    }
  }

  // Ensure keeper
  if (!xi.some(s => isRole(s.player, 'wicket-keeper')) && keepers.length) {
    const k = keepers.find(s => !xi.some(x => String(x.player._id) === String(s.player._id)));
    if (k) {
      xi.push(k);
      roleAdd(k.player);
    }
  }

  // Fill remaining spots with balance
  for (const s of scored) {
    if (xi.length >= maxXI) break;
    if (xi.some(x => String(x.player._id) === String(s.player._id))) continue;
    // target balance
    const wantBats = strategy === 'bat-heavy' ? 6 : strategy === 'bowl-heavy' ? 5 : 5;
    const wantBowls = strategy === 'bowl-heavy' ? 5 : strategy === 'bat-heavy' ? 4 : 4;
    const wantAR =  maxXI - 1 - wantBats - wantBowls; // leaving one slot flex

    // prefer roles under quota
    const p = s.player;
    const isK = isRole(p, 'wicket-keeper');
    const isB = isRole(p, 'batsman');
    const isBow = isRole(p, 'bowler');
    const isAR = (!isB && !isBow && !isK);

    if (isK && !xi.some(x => isRole(x.player, 'wicket-keeper'))) {
      xi.push(s); roleAdd(p); continue;
    }
    if (isB && counts.bats < wantBats) { xi.push(s); roleAdd(p); continue; }
    if (isBow && counts.bowls < wantBowls) { xi.push(s); roleAdd(p); continue; }
    if (isAR && counts.ar < wantAR) { xi.push(s); roleAdd(p); continue; }
  }

  // If still short, fill best remaining
  for (const s of scored) {
    if (xi.length >= maxXI) break;
    if (xi.some(x => String(x.player._id) === String(s.player._id))) continue;
    xi.push(s);
  }

  // Bench are next best not in xi
  for (const s of scored) {
    if (!xi.some(x => String(x.player._id) === String(s.player._id))) bench.push(s);
  }

  const notes = [];
  if (counts.bowls + counts.ar < 5) notes.push('Bowling options below 5; consider adding a bowler/all-rounder.');
  if (!xi.some(s => isRole(s.player, 'wicket-keeper'))) notes.push('No wicket-keeper selected; please tag a keeper.');

  return {
    xi: xi.slice(0, maxXI).map(s => ({ player: s.player, score: s.score })),
    bench: bench.slice(0, 5).map(s => ({ player: s.player, score: s.score })),
    notes
  };
}

router.post('/team', async (req, res) => {
  try {
    const { playerIds, format, pitch, strategy, locks, maxXI } = req.body || {};
    const query = {};
    if (Array.isArray(playerIds) && playerIds.length) {
      query._id = { $in: playerIds };
    }
    const players = await Player.find(query).lean();
    if (!players.length) {
      return res.status(400).json({ message: 'No players available to predict team.' });
    }
    const result = scorePlayers(players, { format, pitch, strategy, locks, maxXI });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
  


