const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Protect all admin endpoints
router.use(authenticateToken, authorizeRoles('admin'));

// @route   GET /api/admin/users
// @desc    List all users in the system
router.get('/users', async (req, res) => {
  try {
    const users = await db.User.find({});
    // Remove passwords before returning
    const safeUsers = users.map(u => {
      const { password, ...safe } = u;
      return safe;
    });
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error listing users.' });
  }
});

// @route   PUT /api/admin/verify-trainer/:id
// @desc    Approve and verify a trainer's account
router.put('/verify-trainer/:id', async (req, res) => {
  try {
    const user = await db.User.findById(req.params.id);
    if (!user || user.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found.' });
    }

    const updatedTrainer = await db.User.findByIdAndUpdate(req.params.id, { isVerified: true });
    res.json({ message: `Trainer ${user.name} verified successfully.`, userId: user.id });
  } catch (error) {
    console.error('Error verifying trainer:', error);
    res.status(500).json({ message: 'Server error verifying trainer.' });
  }
});

// @route   DELETE /api/admin/users/:id
// @desc    Remove a user profile
router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await db.User.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics for Admin Overview
router.get('/stats', async (req, res) => {
  try {
    const users = await db.User.find({});
    const bookings = await db.Booking.find({});
    
    const totalTrainers = users.filter(u => u.role === 'trainer').length;
    const verifiedTrainers = users.filter(u => u.role === 'trainer' && u.isVerified).length;
    const pendingTrainers = totalTrainers - verifiedTrainers;
    
    const totalLearners = users.filter(u => u.role === 'learner').length;
    
    // Count distinct skills taught by verified trainers
    const activeSkills = new Set();
    users.filter(u => u.role === 'trainer' && u.isVerified).forEach(t => {
      if (t.skills) {
        t.skills.forEach(s => activeSkills.add(s));
      }
    });

    // Count distinct villages
    const activeVillages = new Set();
    users.forEach(u => {
      if (u.village) activeVillages.add(u.village);
    });

    const bookingStats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      approved: bookings.filter(b => b.status === 'approved').length,
      rejected: bookings.filter(b => b.status === 'rejected').length,
      completed: bookings.filter(b => b.status === 'completed').length
    };

    res.json({
      trainersCount: totalTrainers,
      verifiedTrainersCount: verifiedTrainers,
      pendingTrainersCount: pendingTrainers,
      learnersCount: totalLearners,
      skillsCount: activeSkills.size,
      villagesCount: activeVillages.size,
      bookingStats
    });

  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({ message: 'Server error loading analytics.' });
  }
});

module.exports = router;
