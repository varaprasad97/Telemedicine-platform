const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { auth, checkRole } = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const DoctorAvailability = require('../models/DoctorAvailability');
const User = require('../models/User');

// Get all appointments for a user (patient or doctor)
router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctor: req.user._id }
      : { patient: req.user._id };
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialty')
      .sort({ date: 1, time: 1 });
    
    res.json(appointments);
  } catch (err) {
    console.error('Error fetching appointments:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get available time slots for a doctor on a specific date
router.get('/availability/:doctorId/:date', auth, async (req, res) => {
  try {
    const { doctorId, date } = req.params;
    const dayOfWeek = new Date(date).getDay();
    
    const availability = await DoctorAvailability.findOne({
      doctor: doctorId,
      dayOfWeek
    });

    if (!availability) {
      return res.json({ availableSlots: [] });
    }

    // Filter out booked slots
    const availableSlots = availability.timeSlots
      .filter(slot => !slot.isBooked)
      .map(slot => ({
        start: slot.start,
        end: slot.end
      }));

    res.json({ availableSlots });
  } catch (err) {
    console.error('Error fetching availability:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book a new appointment
router.post('/', auth, async (req, res) => {
  try {
    const { name, date, time, symptoms } = req.body;
    console.log('Received appointment booking request:', req.body);

    // Validate required fields
    if (!name || !date || !time || !symptoms) {
      return res.status(400).json({ message: 'Please fill in all required fields' });
    }

    // Validate date is not in the past
    const appointmentDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (appointmentDate < today) {
      return res.status(400).json({ message: 'Cannot book appointment for past dates' });
    }

    // Check if user already has an appointment at the same time
    const existingAppointment = await Appointment.findOne({
      patient: req.user._id,
      date: date,
      time: time,
      status: { $in: ['pending', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'You already have an appointment at this time' });
    }

    // Create new appointment
    const appointment = new Appointment({
      patient: req.user._id,
      patientName: name,
      date: date,
      time: time,
      symptoms: symptoms,
      status: 'pending'
    });

    await appointment.save();
    console.log('Appointment saved successfully:', appointment);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      appointment: {
        id: appointment._id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status
      }
    });
  } catch (err) {
    console.error('Appointment booking error:', err);
    res.status(500).json({ message: 'Error booking appointment', error: err.message });
  }
});

// Update appointment status
router.patch('/:id/status', [
  auth,
  checkRole(['doctor', 'patient']),
  check('status', 'Valid status is required').isIn(['pending', 'confirmed', 'cancelled', 'completed'])
], async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    // Check if user has permission to update
    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'doctor' && appointment.doctor && appointment.doctor.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    appointment.status = req.body.status;
    await appointment.save();

    res.json(appointment);
  } catch (err) {
    console.error('Error updating appointment:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Cancel appointment
router.put('/:id/cancel', auth, async (req, res) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      patient: req.user._id
    });

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel a completed appointment' });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling appointment:', err);
    res.status(500).json({ message: 'Error cancelling appointment' });
  }
});

module.exports = router; 