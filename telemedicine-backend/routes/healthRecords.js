const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const HealthRecord = require('../models/HealthRecord');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/health-records');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.'));
    }
  }
});

// Get all health records for a user
router.get('/', auth, async (req, res) => {
  try {
    const records = await HealthRecord.find({ user: req.user.id })
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Upload a new health record
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const fileUrl = `/uploads/health-records/${req.file.filename}`;
    const fileType = path.extname(req.file.originalname).toLowerCase();

    const newRecord = new HealthRecord({
      user: req.user.id,
      title,
      description,
      date,
      fileUrl,
      fileType
    });

    await newRecord.save();
    res.json(newRecord);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a health record
router.delete('/:id', auth, async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);
    
    if (!record) {
      return res.status(404).json({ msg: 'Record not found' });
    }

    // Check if user owns the record
    if (record.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    await record.remove();
    res.json({ msg: 'Record removed' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 