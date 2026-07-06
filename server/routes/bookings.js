const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/bookings/request
// @desc    Submit a training request
router.post('/request', authenticateToken, async (req, res) => {
  const { trainerId, skillName, date, time } = req.body;

  if (!trainerId || !skillName || !date || !time) {
    return res.status(400).json({ message: 'All booking fields (trainerId, skillName, date, time) are required.' });
  }

  try {
    // Verify trainer exists
    const trainer = await db.User.findById(trainerId);
    if (!trainer || trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found.' });
    }

    // Verify trainer and learner are from the same village
    const learner = await db.User.findById(req.user.id);
    if (!learner) {
      return res.status(404).json({ message: 'Learner profile not found.' });
    }

    if (!learner.village || !trainer.village || learner.village.toLowerCase() !== trainer.village.toLowerCase()) {
      return res.status(400).json({ message: 'Skill sharing is strictly restricted to residents of the same village.' });
    }

    const bookingData = {
      learnerId: req.user.id,
      learnerName: req.user.name,
      trainerId,
      trainerName: trainer.name,
      skillName,
      date,
      time,
      status: 'pending', // pending, approved, rejected, completed
      createdAt: new Date().toISOString()
    };

    const newBooking = await db.Booking.create(bookingData);
    res.status(201).json(newBooking);

  } catch (error) {
    console.error('Error creating booking request:', error);
    res.status(500).json({ message: 'Server error processing request.' });
  }
});

// @route   GET /api/bookings/my-bookings
// @desc    Get all bookings for the logged-in user (Trainer / Learner)
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    let bookings = [];

    if (req.user.role === 'learner') {
      bookings = await db.Booking.find({ learnerId: req.user.id });
    } else if (req.user.role === 'trainer') {
      bookings = await db.Booking.find({ trainerId: req.user.id });
    } else if (req.user.role === 'admin') {
      bookings = await db.Booking.find({});
    }

    // Sort by creation or date desc
    bookings.sort((a, b) => new Date(b.date + 'T' + (b.time.includes('AM') || b.time.includes('PM') ? '00:00:00' : b.time)) - new Date(a.date + 'T' + (a.time.includes('AM') || a.time.includes('PM') ? '00:00:00' : a.time)));

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status (Approve / Reject / Complete)
router.put('/:id/status', authenticateToken, async (req, res) => {
  const { status } = req.body;
  const bookingId = req.params.id;

  if (!['approved', 'rejected', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid booking status.' });
  }

  try {
    const booking = await db.Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Ensure user is the assigned trainer (or admin)
    if (booking.trainerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. You are not authorized to edit this request.' });
    }

    const updatedBooking = await db.Booking.findByIdAndUpdate(bookingId, { status });
    res.json(updatedBooking);

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
