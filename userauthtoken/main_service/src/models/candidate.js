const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'Please provide first name'],
  },
  last_name: {
    type: String,
    required: [true, 'Please provide last name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide valid email'],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);

// main-service/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
  }
};

module.exports = { protect };

// main-service/src/controllers/authController.js
const User = require('../models/user');
const { generateToken } = require('../config/jwt');
const crypto = require('crypto');

const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const api_key = crypto.randomBytes(32).toString('hex');
    
    const user = await User.create({
      first_name,
      last_name,
      email,
      password_hash: password,
      api_key
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      api_key
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password_hash');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const protected = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'You have access to protected route',
    user: req.user
  });
};

module.exports = { register, login, protected };

// main-service/src/controllers/candidateController.js
const Candidate = require('../models/candidate');

const addCandidate = async (req, res) => {
  try {
    const { first_name, last_name, email } = req.body;
    
    const candidate = await Candidate.create({
      first_name,
      last_name,
      email,
      user_id: req.user._id
    });

    res.status(201).json({
      success: true,
      data: candidate
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find({ user_id: req.user._id });
    
    res.status(200).json({
      success: true,
      data: candidates
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { addCandidate, getCandidates };
