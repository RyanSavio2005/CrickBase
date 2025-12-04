const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    trim: true,
    default: 'All-rounder',
    enum: ['Batsman', 'Bowler', 'All-rounder', 'Wicket-keeper', 'Wicket-keeper Batsman']
  },
  gender: {
    type: String,
    trim: true,
    enum: ['Male', 'Female', 'Other'],
  },
  bio: {
    type: String,
    trim: true,
    default: ''
  },
  tags: {
    type: [String],
    default: []
  },
  stats: {
    matches: {
      type: Number,
      default: 0
    },
    runs: {
      type: Number,
      default: 0
    },
    wickets: {
      type: Number,
      default: 0
    },
    average: {
      type: Number,
      default: 0
    }
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Player', playerSchema);

