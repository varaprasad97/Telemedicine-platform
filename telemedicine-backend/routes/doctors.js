const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');

// Get all doctors
router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get doctor by ID
router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add sample doctors
router.post('/add-sample', async (req, res) => {
  try {
    const sampleDoctors = [
      {
        name: 'Dr. Sarah Johnson',
        specialty: 'Cardiology',
        experience: '15 years',
        education: 'MD, Harvard Medical School',
        availability: {
          monday: ['09:00-10:00', '14:00-15:00', '16:00-17:00'],
          tuesday: ['10:00-11:00', '15:00-16:00'],
          wednesday: ['09:00-10:00', '14:00-15:00'],
          thursday: ['11:00-12:00', '16:00-17:00'],
          friday: ['09:00-10:00', '14:00-15:00']
        }
      },
      {
        name: 'Dr. Michael Chen',
        specialty: 'Neurology',
        experience: '12 years',
        education: 'MD, Stanford Medical School',
        availability: {
          monday: ['10:00-11:00', '15:00-16:00'],
          tuesday: ['09:00-10:00', '14:00-15:00'],
          wednesday: ['11:00-12:00', '16:00-17:00'],
          thursday: ['09:00-10:00', '14:00-15:00'],
          friday: ['10:00-11:00', '15:00-16:00']
        }
      },
      {
        name: 'Dr. Emily Brown',
        specialty: 'Pediatrics',
        experience: '10 years',
        education: 'MD, Johns Hopkins Medical School',
        availability: {
          monday: ['11:00-12:00', '16:00-17:00'],
          tuesday: ['09:00-10:00', '14:00-15:00'],
          wednesday: ['10:00-11:00', '15:00-16:00'],
          thursday: ['09:00-10:00', '14:00-15:00'],
          friday: ['11:00-12:00', '16:00-17:00']
        }
      },
      {
        name: 'Dr. James Wilson',
        specialty: 'Orthopedics',
        experience: '18 years',
        education: 'MD, Mayo Clinic School of Medicine',
        availability: {
          monday: ['09:00-10:00', '14:00-15:00'],
          tuesday: ['11:00-12:00', '16:00-17:00'],
          wednesday: ['10:00-11:00', '15:00-16:00'],
          thursday: ['09:00-10:00', '14:00-15:00'],
          friday: ['11:00-12:00', '16:00-17:00']
        }
      }
    ];

    await Doctor.deleteMany({}); // Clear existing doctors
    const doctors = await Doctor.insertMany(sampleDoctors);
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 