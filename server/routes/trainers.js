const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// @route   GET /api/trainers
// @desc    Get all verified trainers with optional search filters
router.get('/', async (req, res) => {
  const { skill, village, language, query } = req.query;
  
  try {
    const searchFilter = { role: 'trainer', isVerified: true };

    let trainers = await db.User.find(searchFilter);

    // Filter strictly by user village if learner is logged in
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    let userVillage = null;

    if (token) {
      try {
        const verified = jwt.verify(token, JWT_SECRET);
        const loggedInUser = await db.User.findById(verified.id);
        if (loggedInUser && loggedInUser.role === 'learner') {
          userVillage = loggedInUser.village;
        }
      } catch (err) {
        // Ignore invalid token
      }
    }

    if (userVillage) {
      trainers = trainers.filter(t => t.village && t.village.toLowerCase() === userVillage.toLowerCase());
    } else if (village) {
      trainers = trainers.filter(t => t.village && t.village.toLowerCase().includes(village.toLowerCase()));
    }

    // Filter by skill
    if (skill) {
      trainers = trainers.filter(t => t.skills && t.skills.some(s => s.toLowerCase().includes(skill.toLowerCase())));
    }

    // Filter by language
    if (language) {
      trainers = trainers.filter(t => t.languages && t.languages.some(l => l.toLowerCase().includes(language.toLowerCase())));
    }

    // Live search query matching name, bio or skill
    if (query) {
      const q = query.toLowerCase();
      trainers = trainers.filter(t => 
        t.name.toLowerCase().includes(q) || 
        (t.bio && t.bio.toLowerCase().includes(q)) ||
        (t.skills && t.skills.some(s => s.toLowerCase().includes(q))) ||
        (t.village && t.village.toLowerCase().includes(q))
      );
    }

    // Strip passwords before sending
    const safeTrainers = trainers.map(t => {
      const { password, ...safe } = t;
      return safe;
    });

    res.json(safeTrainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    res.status(500).json({ message: 'Server error fetching trainers.' });
  }
});

// @route   GET /api/trainers/:id
// @desc    Get single trainer details
router.get('/:id', async (req, res) => {
  try {
    const trainer = await db.User.findById(req.params.id);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found.' });
    }

    const { password, ...safeTrainer } = trainer;
    res.json(safeTrainer);
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   POST /api/trainers/:id/review
// @desc    Submit review for a trainer
router.post('/:id/review', authenticateToken, async (req, res) => {
  const { rating, text } = req.body;
  const trainerId = req.params.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Please provide a valid rating between 1 and 5.' });
  }

  try {
    const trainer = await db.User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found.' });
    }

    const newReview = {
      learnerName: req.user.name,
      rating: Number(rating),
      text: text || '',
      date: new Date().toISOString().split('T')[0]
    };

    trainer.reviews = trainer.reviews || [];
    trainer.reviews.push(newReview);

    // Recalculate average rating
    const totalRating = trainer.reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const avgRating = Number((totalRating / trainer.reviews.length).toFixed(1));

    await db.User.findByIdAndUpdate(trainerId, {
      reviews: trainer.reviews,
      rating: avgRating
    });

    res.status(201).json({ message: 'Review added successfully', rating: avgRating, reviews: trainer.reviews });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/trainers/profile
// @desc    Update current user profile (Both trainers and learners)
router.put('/profile/update', authenticateToken, async (req, res) => {
  const updateFields = {};
  const allowedFields = [
    'name', 'phone', 'village', 'skills', 'experience', 
    'languages', 'timings', 'fee', 'bio', 'photo', 'favorites'
  ];

  for (let key of allowedFields) {
    if (req.body[key] !== undefined) {
      updateFields[key] = req.body[key];
    }
  }

  try {
    const updatedUser = await db.User.findByIdAndUpdate(req.user.id, updateFields);
    const { password, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile.' });
  }
});

// @route   POST /api/trainers/favorites/:id
// @desc    Toggle favorite trainer status for learner
router.post('/favorites/toggle/:id', authenticateToken, async (req, res) => {
  const trainerId = req.params.id;

  try {
    const learner = await db.User.findById(req.user.id);
    if (!learner || learner.role !== 'learner') {
      return res.status(403).json({ message: 'Only learners can favorite trainers.' });
    }

    learner.favorites = learner.favorites || [];
    const index = learner.favorites.indexOf(trainerId);

    if (index > -1) {
      learner.favorites.splice(index, 1); // remove
    } else {
      learner.favorites.push(trainerId); // add
    }

    await db.User.findByIdAndUpdate(req.user.id, { favorites: learner.favorites });
    res.json({ favorites: learner.favorites });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
