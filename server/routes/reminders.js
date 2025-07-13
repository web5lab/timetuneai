const express = require('express');
const jwt = require('jsonwebtoken');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Token verification error:', error);
    res.status(401).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// @route   GET /reminders
// @desc    Get all reminders for user
// @access  Private
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, completed, date } = req.query;
    
    let filter = { userId: req.user._id };
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    if (completed !== undefined) {
      filter.isCompleted = completed === 'true';
    }
    
    if (date) {
      filter.date = date;
    }

    const reminders = await Reminder.find(filter)
      .sort({ date: 1, time: 1 })
      .lean();

    res.json({
      success: true,
      count: reminders.length,
      reminders
    });
  } catch (error) {
    console.error('❌ Get reminders error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch reminders' 
    });
  }
});

// @route   POST /reminders
// @desc    Create new reminder
// @access  Private
router.post('/', authenticateToken, async (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      priority,
      category,
      isRecurring,
      recurrencePattern
    } = req.body;

    if (!title || !date || !time) {
      return res.status(400).json({
        success: false,
        message: 'Title, date, and time are required'
      });
    }

    const reminder = new Reminder({
      userId: req.user._id,
      title: title.trim(),
      description: description?.trim() || '',
      date,
      time,
      priority: priority || 'medium',
      category: category || 'personal',
      isRecurring: isRecurring || false,
      recurrencePattern: recurrencePattern || ''
    });

    await reminder.save();

    // Update user stats
    await req.user.incrementReminderStats();

    res.status(201).json({
      success: true,
      message: 'Reminder created successfully',
      reminder
    });
  } catch (error) {
    console.error('❌ Create reminder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create reminder' 
    });
  }
});

// @route   PUT /reminders/:id
// @desc    Update reminder
// @access  Private
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        reminder[key] = req.body[key];
      }
    });

    await reminder.save();

    res.json({
      success: true,
      message: 'Reminder updated successfully',
      reminder
    });
  } catch (error) {
    console.error('❌ Update reminder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update reminder' 
    });
  }
});

// @route   DELETE /reminders/:id
// @desc    Delete reminder
// @access  Private
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    res.json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete reminder error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete reminder' 
    });
  }
});

// @route   PATCH /reminders/:id/complete
// @desc    Toggle reminder completion
// @access  Private
router.patch('/:id/complete', authenticateToken, async (req, res) => {
  try {
    const reminder = await Reminder.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    reminder.isCompleted = !reminder.isCompleted;
    reminder.completedAt = reminder.isCompleted ? new Date() : null;
    
    await reminder.save();

    // Update user stats if completed
    if (reminder.isCompleted) {
      await req.user.incrementReminderStats(true);
    }

    res.json({
      success: true,
      message: `Reminder ${reminder.isCompleted ? 'completed' : 'uncompleted'} successfully`,
      reminder
    });
  } catch (error) {
    console.error('❌ Toggle completion error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update reminder' 
    });
  }
});

module.exports = router;