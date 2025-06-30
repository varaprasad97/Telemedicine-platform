const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Appointment = require('../models/Appointment');
const { auth, checkRole } = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const PaymentService = require('../services/paymentService');

// @route   POST /api/payments
// @desc    Create a new payment
// @access  Private
router.post('/', [
  auth,
  [
    check('appointment', 'Appointment ID is required').not().isEmpty(),
    check('amount', 'Amount is required').isNumeric(),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('transactionId', 'Transaction ID is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const appointment = await Appointment.findById(req.body.appointment);
    if (!appointment) {
      return res.status(404).json({ msg: 'Appointment not found' });
    }

    // Verify the payment amount matches the appointment amount
    if (appointment.amount !== req.body.amount) {
      return res.status(400).json({ msg: 'Payment amount does not match appointment amount' });
    }

    const newPayment = new Payment({
      appointment: req.body.appointment,
      patient: req.user.id,
      doctor: appointment.doctor,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      transactionId: req.body.transactionId
    });

    const payment = await newPayment.save();

    // Update appointment payment status
    appointment.paymentStatus = 'completed';
    await appointment.save();

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/payments
// @desc    Get all payments for the logged-in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({
      $or: [{ patient: req.user.id }, { doctor: req.user.id }]
    })
    .populate('appointment')
    .populate('patient', 'name email')
    .populate('doctor', 'name email specialty')
    .sort({ paymentDate: -1 });
    
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('appointment')
      .populate('patient', 'name email')
      .populate('doctor', 'name email specialty');

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    // Check if user is authorized to view this payment
    if (payment.patient._id.toString() !== req.user.id && 
        payment.doctor._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/payments/:id/refund
// @desc    Process a refund
// @access  Private (Doctor only)
router.put('/:id/refund', [
  auth,
  [
    check('reason', 'Refund reason is required').not().isEmpty()
  ]
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ msg: 'Payment not found' });
    }

    // Check if user is the doctor
    if (payment.doctor.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    // Check if payment is already refunded
    if (payment.status === 'refunded') {
      return res.status(400).json({ msg: 'Payment already refunded' });
    }

    payment.status = 'refunded';
    payment.refundDetails = {
      amount: payment.amount,
      reason: req.body.reason,
      date: Date.now()
    };

    await payment.save();

    // Update appointment payment status
    const appointment = await Appointment.findById(payment.appointment);
    if (appointment) {
      appointment.paymentStatus = 'refunded';
      await appointment.save();
    }

    res.json(payment);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Payment not found' });
    }
    res.status(500).send('Server Error');
  }
});

// Create payment intent
router.post('/create-intent', [
  auth,
  checkRole(['patient']),
  async (req, res) => {
    try {
      const { appointmentId } = req.body;
      
      // Verify appointment exists and belongs to the patient
      const appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (appointment.patient.toString() !== req.user._id) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      const { clientSecret, paymentId } = await PaymentService.createPaymentIntent(
        appointmentId,
        appointment.amount
      );

      res.json({
        clientSecret,
        paymentId
      });
    } catch (err) {
      console.error('Error creating payment intent:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
]);

// Handle successful payment (webhook)
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      await PaymentService.handleSuccessfulPayment(event.data.object.id);
    }

    res.json({ received: true });
  } catch (err) {
    console.error('Error handling webhook:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Request refund
router.post('/refund/:paymentId', [
  auth,
  checkRole(['admin', 'doctor']),
  async (req, res) => {
    try {
      const { paymentId } = req.params;
      const { amount } = req.body;

      const refund = await PaymentService.handleRefund(paymentId, amount);
      res.json(refund);
    } catch (err) {
      console.error('Error processing refund:', err);
      res.status(500).json({ message: 'Server error' });
    }
  }
]);

// Get payment status
router.get('/status/:paymentId', auth, async (req, res) => {
  try {
    const { paymentId } = req.params;
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user has permission to view this payment
    const appointment = await Appointment.findById(payment.appointment);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (req.user.role === 'patient' && appointment.patient.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (req.user.role === 'doctor' && appointment.doctor.toString() !== req.user._id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const status = await PaymentService.getPaymentStatus(paymentId);
    res.json(status);
  } catch (err) {
    console.error('Error getting payment status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 