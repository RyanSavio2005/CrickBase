const User = require('../models/User');

// Simple authentication middleware - checks if user is logged in
// In a simple system, we'll just check if userId is in the request
// Frontend will send userId in headers after login
const authenticateUser = async (req, res, next) => {
  try {
    const userId = req.headers['user-id'] || req.body.userId;

    if (!userId) {
      return res.status(401).json({ message: 'Access denied. Please login.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user. Please login again.' });
    }

    req.user = user;
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed.' });
  }
};

module.exports = { authenticateUser };
