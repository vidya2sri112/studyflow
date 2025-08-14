const express = require('express');
const Session = require('../models/Session');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Get all sessions for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .populate('task', 'title')
      .sort({ startTime: -1 });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new session
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, duration, startTime, endTime, task } = req.body;
    
    const session = new Session({
      type,
      duration,
      startTime,
      endTime,
      task,
      user: req.user._id
    });

    await session.save();
    await session.populate('task', 'title');
    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get session stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todaySessions = await Session.find({
      user: req.user._id,
      startTime: { $gte: today }
    });

    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - 7);
    
    const weekSessions = await Session.find({
      user: req.user._id,
      startTime: { $gte: thisWeek }
    });

    res.json({
      today: {
        count: todaySessions.length,
        totalMinutes: todaySessions.reduce((sum, s) => sum + s.duration, 0)
      },
      week: {
        count: weekSessions.length,
        totalMinutes: weekSessions.reduce((sum, s) => sum + s.duration, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;