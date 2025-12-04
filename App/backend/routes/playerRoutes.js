const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Player = require('../models/Player');
const { authenticateUser } = require('../middleware/auth');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
  
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'player-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// GET all players with optional search
router.get('/', async (req, res) => {
  try {
    const {
      search, country, role, gender, tags,
      runsMin, runsMax, wicketsMin, wicketsMax,
      matchesMin, matchesMax, averageMin, averageMax,
      sortBy, sortOrder
    } = req.query;

    const query = {};

    // Search by name, country, or role
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by country
    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    // Filter by role
    if (role) {
      query.role = { $regex: role, $options: 'i' };
    }

    // Filter by gender
    if (gender) {
      query.gender = { $regex: gender, $options: 'i' };
    }

    // Filter by tags (any match)
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : String(tags).split(',').map(t => t.trim()).filter(Boolean);
      if (tagArray.length) {
        query.tags = { $in: tagArray };
      }
    }

    // Numeric range filters
    if (runsMin || runsMax) {
      query['stats.runs'] = {};
      if (runsMin) query['stats.runs'].$gte = parseInt(runsMin);
      if (runsMax) query['stats.runs'].$lte = parseInt(runsMax);
    }
    if (wicketsMin || wicketsMax) {
      query['stats.wickets'] = {};
      if (wicketsMin) query['stats.wickets'].$gte = parseInt(wicketsMin);
      if (wicketsMax) query['stats.wickets'].$lte = parseInt(wicketsMax);
    }
    if (matchesMin || matchesMax) {
      query['stats.matches'] = {};
      if (matchesMin) query['stats.matches'].$gte = parseInt(matchesMin);
      if (matchesMax) query['stats.matches'].$lte = parseInt(matchesMax);
    }
    if (averageMin || averageMax) {
      query['stats.average'] = {};
      if (averageMin) query['stats.average'].$gte = parseFloat(averageMin);
      if (averageMax) query['stats.average'].$lte = parseFloat(averageMax);
    }

    // Sorting
    const validSortFields = ['stats.runs', 'stats.wickets', 'stats.matches', 'stats.average', 'createdAt', 'name'];
    const sort = {};
    if (sortBy && validSortFields.includes(sortBy)) {
      sort[sortBy] = (sortOrder === 'asc' ? 1 : -1);
    } else {
      sort['createdAt'] = -1;
    }

    const players = await Player.find(query).sort(sort);
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single player by ID
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }
    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create new player (Logged in users only)
router.post('/', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const { name, country, role, gender, bio, tags, matches, runs, wickets, average } = req.body;
    
    const playerData = {
      name,
      country,
      role: role || 'All-rounder',
      gender,
      bio: bio || '',
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []),
      stats: {
        matches: parseInt(matches) || 0,
        runs: parseInt(runs) || 0,
        wickets: parseInt(wickets) || 0,
        average: parseFloat(average) || 0
      }
    };

    // Add image path if uploaded
    if (req.file) {
      playerData.image = `/uploads/${req.file.filename}`;
    }

    const player = new Player(playerData);
    await player.save();
    res.status(201).json(player);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

// PUT update player (Logged in users only)
router.put('/:id', authenticateUser, upload.single('image'), async (req, res) => {
  try {
    const { name, country, role, gender, bio, tags, matches, runs, wickets, average } = req.body;
    
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    // Update player data
    player.name = name || player.name;
    player.country = country || player.country;
    if (role !== undefined) player.role = role;
    if (gender !== undefined) player.gender = gender;
    if (bio !== undefined) player.bio = bio;
    if (tags !== undefined) {
      player.tags = Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map(t => t.trim()).filter(Boolean) : []);
    }
    
    if (matches !== undefined) player.stats.matches = parseInt(matches);
    if (runs !== undefined) player.stats.runs = parseInt(runs);
    if (wickets !== undefined) player.stats.wickets = parseInt(wickets);
    if (average !== undefined) player.stats.average = parseFloat(average);

    // Handle image update
    if (req.file) {
      // Delete old image if exists
      if (player.image) {
        const oldImagePath = path.join(__dirname, '..', player.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      player.image = `/uploads/${req.file.filename}`;
    }

    await player.save();
    res.json(player);
  } catch (error) {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ message: error.message });
    }
    res.status(400).json({ message: error.message });
  }
});

// DELETE player (Logged in users only)
router.delete('/:id', authenticateUser, async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ message: 'Player not found' });
    }

    
    if (player.image) {
      const imagePath = path.join(__dirname, '..', player.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

