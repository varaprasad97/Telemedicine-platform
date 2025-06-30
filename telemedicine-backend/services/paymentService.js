const stripe = process.env.STRIPE_SECRET_KEY ? require('stripe')(process.env.STRIPE_SECRET_KEY) : null;
const Appointment = require('../models/Appointment');
const Payment = require('../models/Payment');

const PaymentService = {
  // Create a payment intent
  createPaymentIntent: async (appointmentId, amount, currency = 'usd') => {
    try {
      if (!stripe) {
        throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
      }

      const appointment = await Appointment.findById(appointmentId)
        .populate('patient', 'email')
        .populate('doctor', 'name');

      if (!appointment) {
        throw new Error('Appointment not found');
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to cents
        currency,
        metadata: {
          appointmentId: appointmentId,
          patientId: appointment.patient._id.toString(),
          doctorId: appointment.doctor._id.toString()
        }
      });

      // Create payment record
      const payment = new Payment({
        appointment: appointmentId,
        amount,
        currency,
        stripePaymentIntentId: paymentIntent.id,
        status: 'pending'
      });

      await payment.save();

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment._id
      };
    } catch (error) {
      console.error('Payment intent creation error:', error);
      throw error;
    }
  },

  // Handle successful payment
  handleSuccessfulPayment: async (paymentIntentId) => {
    try {
      const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntentId });
      if (!payment) {
        throw new Error('Payment not found');
      }

      payment.status = 'completed';
      await payment.save();

      // Update appointment payment status
      const appointment = await Appointment.findById(payment.appointment);
      if (appointment) {
        appointment.paymentStatus = 'paid';
        await appointment.save();
      }

      return payment;
    } catch (error) {
      console.error('Payment handling error:', error);
      throw error;
    }
  },

  // Handle refund
  handleRefund: async (paymentId, amount) => {
    try {
      if (!stripe) {
        throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY in environment variables.');
      }

      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      const refund = await stripe.refunds.create({
        payment_intent: payment.stripePaymentIntentId,
        amount: amount * 100 // Convert to cents
      });

      payment.status = 'refunded';
      await payment.save();

      // Update appointment payment status
      const appointment = await Appointment.findById(payment.appointment);
      if (appointment) {
        appointment.paymentStatus = 'refunded';
        await appointment.save();
      }

      return refund;
    } catch (error) {
      console.error('Refund handling error:', error);
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId) => {
    try {
      const payment = await Payment.findById(paymentId);
      if (!payment) {
        throw new Error('Payment not found');
      }

      if (stripe && payment.stripePaymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(payment.stripePaymentIntentId);
        return { payment, paymentIntent };
      }

      return { payment };
    } catch (error) {
      console.error('Payment status retrieval error:', error);
      throw error;
    }
  }
};

module.exports = PaymentService; 