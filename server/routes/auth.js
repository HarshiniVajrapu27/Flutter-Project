const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a user (Learner / Trainer / Admin)
router.post('/register', async (req, res) => {
  const { name, email, password, role, phone, village, skills, experience, languages, timings, fee, bio } = req.body;

  try {
    // Check if user exists
    const userExists = await db.User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role: role || 'learner',
      phone: phone || '',
      village: village || '',
      isVerified: role === 'trainer' ? false : true, // trainers need admin approval, others verified by default
      createdAt: new Date().toISOString()
    };

    // Trainer specific fields
    if (role === 'trainer') {
      userData.skills = skills || [];
      userData.experience = experience || '0';
      userData.languages = languages || [];
      userData.timings = timings || '';
      userData.fee = fee || 'Free';
      userData.bio = bio || '';
      userData.photo = req.body.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'; // default avatar
      userData.rating = 5.0;
      userData.reviews = [];
    } else if (role === 'learner') {
      userData.skills = skills || []; // interested skills
      userData.favorites = [];
    }

    const newUser = await db.User.create(userData);

    // Generate JWT Token
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isVerified: newUser.isVerified
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Simulate password reset
router.post('/forgot-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await db.User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No user registered with this email.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await db.User.findByIdAndUpdate(user.id, { password: hashedPassword });

    res.json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset.' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db.User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    // Remove password
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
