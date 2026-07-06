const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// @route   GET /api/community/events
// @desc    Get all workshops, announcements, and success stories
router.get('/events', async (req, res) => {
  try {
    const events = await db.Event.find({});
    // Sort events by date descending
    events.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt));
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching events.' });
  }
});

// @route   POST /api/community/events
// @desc    Add a community announcement, workshop, or story (Admin and Trainer authorized)
router.post('/events', authenticateToken, authorizeRoles('admin', 'trainer'), async (req, res) => {
  const { title, description, date, time, village, type, image, author } = req.body;

  if (!title || !description || !type) {
    return res.status(400).json({ message: 'Title, description, and event type are required.' });
  }

  try {
    const newEvent = {
      title,
      description,
      date: date || new Date().toISOString().split('T')[0],
      time: time || '',
      village: village || '',
      type, // 'workshop', 'event', 'story', 'announcement'
      author: type === 'story' ? (author || req.user.name) : '',
      image: image || 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=400',
      likes: 0,
      createdAt: new Date().toISOString()
    };

    const createdEvent = await db.Event.create(newEvent);
    res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Server error saving event.' });
  }
});

// @route   POST /api/community/events/:id/like
// @desc    Increment like count of an event
router.post('/events/:id/like', async (req, res) => {
  try {
    const event = await db.Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    const currentLikes = event.likes || 0;
    const updated = await db.Event.findByIdAndUpdate(req.params.id, { likes: currentLikes + 1 });
    res.json({ id: event.id, likes: currentLikes + 1 });
  } catch (error) {
    res.status(500).json({ message: 'Server error liking event.' });
  }
});

module.exports = router;
