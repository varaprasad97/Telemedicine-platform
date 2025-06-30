const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const VideoService = require('../services/videoService');
const Appointment = require('../models/Appointment');

// Generate video token for a room
router.post('/token', auth, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    
    // Verify appointment exists and user is part of it
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'name')
      .populate('patient', 'name');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.consultationType !== 'video') {
      return res.status(400).json({ message: 'This appointment is not a video consultation' });
    }

    if (appointment.patient._id.toString() !== req.user._id && 
        appointment.doctor._id.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Create room name from appointment ID
    const roomName = `appointment-${appointmentId}`;
    
    // Generate token
    const token = VideoService.generateToken(
      req.user.name,
      roomName
    );

    // Create or get room
    try {
      await VideoService.createRoom(roomName);
    } catch (error) {
      // Room might already exist, which is fine
      console.log('Room might already exist:', error.message);
    }

    res.json({
      token,
      roomName,
      appointment
    });
  } catch (err) {
    console.error('Error generating video token:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// End video consultation
router.post('/end/:appointmentId', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Verify appointment exists and user is part of it
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient._id.toString() !== req.user._id && 
        appointment.doctor._id.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // End the video room
    const roomName = `appointment-${appointmentId}`;
    await VideoService.endRoom(roomName);

    // Update appointment status
    appointment.status = 'completed';
    await appointment.save();

    res.json({ message: 'Video consultation ended successfully' });
  } catch (err) {
    console.error('Error ending video consultation:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video room status
router.get('/status/:appointmentId', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    // Verify appointment exists and user is part of it
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient._id.toString() !== req.user._id && 
        appointment.doctor._id.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get room status
    const roomName = `appointment-${appointmentId}`;
    const room = await VideoService.getRoomStatus(roomName);

    res.json({ room });
  } catch (err) {
    console.error('Error getting video room status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get appointment details for video consultation
router.get('/appointment/:appointmentId', auth, async (req, res) => {
  try {
    const { appointmentId } = req.params;
    
    const appointment = await Appointment.findById(appointmentId)
      .populate('doctor', 'name email')
      .populate('patient', 'name email');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.consultationType !== 'video') {
      return res.status(400).json({ message: 'This appointment is not a video consultation' });
    }

    if (appointment.patient._id.toString() !== req.user._id && 
        appointment.doctor._id.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(appointment);
  } catch (err) {
    console.error('Error getting appointment details:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 