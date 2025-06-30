const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Emergency = require('../models/Emergency');

// Create an emergency alert
router.post('/alert', auth, async (req, res) => {
  try {
    const { location, description } = req.body;

    if (!location || !description) {
      return res.status(400).json({ msg: 'Please provide location and description' });
    }

    const newEmergency = new Emergency({
      user: req.user.id,
      location,
      description,
      status: 'active'
    });

    await newEmergency.save();

    // In a real application, this would:
    // 1. Notify nearby hospitals
    // 2. Send alerts to emergency services
    // 3. Contact the user's emergency contacts
    // 4. Track the emergency response

    res.json({
      msg: 'Emergency alert sent successfully',
      emergency: newEmergency
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get emergency status
router.get('/status/:id', auth, async (req, res) => {
  try {
    const emergency = await Emergency.findById(req.params.id);

    if (!emergency) {
      return res.status(404).json({ msg: 'Emergency not found' });
    }

    // Check if user owns the emergency or is authorized
    if (emergency.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(emergency);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Update emergency status
router.put('/status/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ msg: 'Please provide status' });
    }

    const emergency = await Emergency.findById(req.params.id);

    if (!emergency) {
      return res.status(404).json({ msg: 'Emergency not found' });
    }

    // Check if user owns the emergency or is authorized
    if (emergency.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    emergency.status = status;
    await emergency.save();

    res.json(emergency);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 