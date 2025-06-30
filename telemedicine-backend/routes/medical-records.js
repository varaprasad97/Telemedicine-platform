const express = require('express');
const router = express.Router();
const MedicalRecord = require('../models/MedicalRecord');
const { auth } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');

// @route   POST /api/medical-records
// @desc    Create a new medical record
// @access  Private (Doctor only)
router.post('/', [
  auth,
  [
    check('patient', 'Patient ID is required').not().isEmpty(),
    check('diagnosis', 'Diagnosis is required').not().isEmpty(),
    check('prescription', 'Prescription is required').isArray(),
    check('prescription.*.medicine', 'Medicine name is required').not().isEmpty(),
    check('prescription.*.dosage', 'Dosage is required').not().isEmpty(),
    check('prescription.*.duration', 'Duration is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(401).json({ msg: 'Only doctors can create medical records' });
    }

    const newMedicalRecord = new MedicalRecord({
      patient: req.body.patient,
      doctor: req.user.id,
      appointment: req.body.appointment,
      diagnosis: req.body.diagnosis,
      prescription: req.body.prescription,
      labReports: req.body.labReports,
      vitals: req.body.vitals,
      notes: req.body.notes,
      followUpDate: req.body.followUpDate,
      attachments: req.body.attachments
    });

    const medicalRecord = await newMedicalRecord.save();
    res.json(medicalRecord);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/medical-records
// @desc    Get all medical records for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    
    // If user is a patient, show only their records
    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    }
    // If user is a doctor, show records they created
    else if (req.user.role === 'doctor') {
      query.doctor = req.user.id;
    }

    const medicalRecords = await MedicalRecord.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialty')
      .populate('appointment')
      .sort({ createdAt: -1 });
    
    res.json(medicalRecords);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/medical-records/:id
// @desc    Get medical record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id)
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialty')
      .populate('appointment');

    if (!medicalRecord) {
      return res.status(404).json({ msg: 'Medical record not found' });
    }

    // Check if user is authorized to view this record
    if (medicalRecord.patient._id.toString() !== req.user.id && 
        medicalRecord.doctor._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(medicalRecord);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Medical record not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/medical-records/:id
// @desc    Update medical record
// @access  Private (Doctor only)
router.put('/:id', auth, async (req, res) => {
  try {
    const medicalRecord = await MedicalRecord.findById(req.params.id);

    if (!medicalRecord) {
      return res.status(404).json({ msg: 'Medical record not found' });
    }

    // Check if user is the doctor who created the record
    if (medicalRecord.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    const {
      diagnosis,
      prescription,
      labReports,
      vitals,
      notes,
      followUpDate,
      attachments
    } = req.body;

    if (diagnosis) medicalRecord.diagnosis = diagnosis;
    if (prescription) medicalRecord.prescription = prescription;
    if (labReports) medicalRecord.labReports = labReports;
    if (vitals) medicalRecord.vitals = vitals;
    if (notes) medicalRecord.notes = notes;
    if (followUpDate) medicalRecord.followUpDate = followUpDate;
    if (attachments) medicalRecord.attachments = attachments;

    await medicalRecord.save();
    res.json(medicalRecord);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Medical record not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router; 