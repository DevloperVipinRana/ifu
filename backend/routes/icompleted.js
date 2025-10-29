// backend/routes/icompleted.js
const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const ICompleted = require('../models/ICompleted');
const { authMiddleware } = require('./auth');

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/icompleted'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// ✅ POST Achievement
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
  try {
    const { achievementText } = req.body;

    if (!achievementText || achievementText.trim().length < 3)
      return res.status(400).json({ message: 'Achievement text too short.' });

    const newAchievement = new ICompleted({
      userId: req.user.id,
      achievementText,
      image: req.file ? `/uploads/icompleted/${req.file.filename}` : null,
    });

    await newAchievement.save();
    res.status(201).json({ message: 'Achievement saved!', achievement: newAchievement });
  } catch (err) {
    console.error('POST /api/icompleted error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// ✅ GET all achievements of logged-in user
router.get('/my', authMiddleware, async (req, res) => {
  try {
    console.log('Fetching achievements for user:', req.user.id); // Debug log
    const achievements = await ICompleted.find({ userId: req.user.id }).sort({ createdAt: -1 });
    console.log('Found achievements:', achievements.length); // Debug log
    res.json(achievements);
  } catch (err) {
    console.error('GET /api/icompleted/my error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;