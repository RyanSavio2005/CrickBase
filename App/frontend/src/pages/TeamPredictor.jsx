import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';

const TeamPredictor = () => {
  const API_URL = 'http://localhost:5000';
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [format, setFormat] = useState('ODI');
  const [pitch, setPitch] = useState('balanced');
  const [strategy, setStrategy] = useState('balanced');
  const [locks, setLocks] = useState([]);
  const [maxXI, setMaxXI] = useState(11);
  const [gender, setGender] = useState(''); // '' | 'Male' | 'Female' | 'Other'

  const [result, setResult] = useState(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/players`);
        setPlayers(res.data);
      } catch (e) {
        setError('Failed to load players');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const toggleLock = (id) => {
    setLocks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const lockedSet = useMemo(() => new Set(locks), [locks]);

  // Filter players by gender for the pool
  const filteredPlayers = useMemo(() => {
    if (!gender) return players;
    return players.filter(p => (p.gender || '').toLowerCase() === gender.toLowerCase());
  }, [players, gender]);

  // Keep locks only for players visible in current pool
  useEffect(() => {
    const visibleIds = new Set(filteredPlayers.map(p => String(p._id)));
    setLocks(prev => prev.filter(id => visibleIds.has(String(id))));
  }, [filteredPlayers]);

  const submitPredict = async () => {
    try {
      setPredicting(true);
      const body = {
        playerIds: filteredPlayers.map(p => p._id),
        format, pitch, strategy, locks, maxXI
      };
      const res = await axios.post(`${API_URL}/api/predict/team`, body);
      setResult(res.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Prediction failed');
    } finally {
      setPredicting(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-spinner">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3">Team Predictor</h1>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card mb-3">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Format</label>
              <select className="form-select" value={format} onChange={e => setFormat(e.target.value)}>
                <option value="Test">Test</option>
                <option value="ODI">ODI</option>
                <option value="T20">T20</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Pitch</label>
              <select className="form-select" value={pitch} onChange={e => setPitch(e.target.value)}>
                <option value="balanced">Balanced</option>
                <option value="flat">Flat</option>
                <option value="pace">Pace-friendly</option>
                <option value="spin">Spin-friendly</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Strategy</label>
              <select className="form-select" value={strategy} onChange={e => setStrategy(e.target.value)}>
                <option value="balanced">Balanced</option>
                <option value="bat-heavy">Bat-heavy</option>
                <option value="bowl-heavy">Bowl-heavy</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">XI Size</label>
              <input className="form-control" type="number" min="5" max="11" value={maxXI} onChange={e => setMaxXI(parseInt(e.target.value) || 11)} />
            </div>
          </div>
          <div className="row g-3 mt-2">
            <div className="col-md-3">
              <label className="form-label">Gender</label>
              <select className="form-select" value={gender} onChange={e => setGender(e.target.value)}>
                <option value="">All</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={submitPredict} disabled={predicting}>
              {predicting ? 'Predicting...' : 'Predict XI'}
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Player Pool</h5>
              <div className="row">
                {filteredPlayers.map(p => (
                  <div key={p._id} className="col-md-6 mb-3">
                    <div className={`card predictor-player-card ${lockedSet.has(p._id) ? 'border-success' : ''}`}>
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          <img
                            src={p.image ? `http://localhost:5000${p.image}` : 'https://via.placeholder.com/80x80?text=No+Image'}
                            alt={p.name}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h6 className="card-title mb-1">{p.name}</h6>
                                <div className="predictor-player-meta">{p.country} · {p.role}</div>
                              </div>
                              <button
                                className={`btn btn-sm ${lockedSet.has(p._id) ? 'btn-success' : 'btn-outline-secondary'}`}
                                onClick={() => toggleLock(p._id)}
                              >
                                {lockedSet.has(p._id) ? 'Locked' : 'Lock'}
                              </button>
                            </div>
                            <div className="predictor-player-stats mt-2">
                              <span className="stats-badge">Runs: {p.stats.runs}</span>
                              <span className="stats-badge">Wkts: {p.stats.wickets}</span>
                              <span className="stats-badge">Avg: {Number(p.stats.average).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Suggested XI</h5>
              {!result && <div className="text-muted">Run prediction to see the XI.</div>}
              {result && (
                <>
                  {result.notes && result.notes.length > 0 && (
                    <div className="alert alert-warning">
                      {result.notes.map((n, i) => <div key={i}>{n}</div>)}
                    </div>
                  )}
                  <ul className="list-group mb-3">
                    {result.xi.map((s, i) => (
                      <li key={s.player._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{i + 1}. {s.player.name} <span className="badge bg-primary ms-2">{s.player.role}</span></span>
                        <span className="badge bg-secondary">Score: {s.score.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <h6>Bench</h6>
                  <ul className="list-group">
                    {result.bench.map((s) => (
                      <li key={s.player._id} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>{s.player.name} <span className="badge bg-light text-dark ms-2">{s.player.role}</span></span>
                        <span className="badge bg-secondary">Score: {s.score.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamPredictor;


