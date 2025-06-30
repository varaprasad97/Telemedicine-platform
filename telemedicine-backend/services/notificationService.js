const nodemailer = require('nodemailer');
const Notification = require('../models/Notification');
const User = require('../models/User');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const NotificationService = {
  // Create a new notification
  createNotification: async (userId, type, title, message, data = {}) => {
    try {
      const notification = new Notification({
        user: userId,
        type,
        title,
        message,
        data
      });

      await notification.save();
      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Send email notification
  sendEmail: async (to, subject, html) => {
    try {
      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },

  // Notify about new appointment
  notifyNewAppointment: async (appointment) => {
    try {
      const doctor = await User.findById(appointment.doctor);
      const patient = await User.findById(appointment.patient);

      // Create notifications
      await NotificationService.createNotification(
        doctor._id,
        'appointment',
        'New Appointment',
        `New appointment scheduled with ${patient.name}`,
        { appointmentId: appointment._id }
      );

      await NotificationService.createNotification(
        patient._id,
        'appointment',
        'Appointment Confirmed',
        `Your appointment with Dr. ${doctor.name} has been confirmed`,
        { appointmentId: appointment._id }
      );

      // Send emails
      const doctorEmailHtml = `
        <h2>New Appointment</h2>
        <p>You have a new appointment with ${patient.name}</p>
        <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
        <p>Time: ${appointment.timeSlot.start} - ${appointment.timeSlot.end}</p>
        <p>Type: ${appointment.consultationType}</p>
      `;

      const patientEmailHtml = `
        <h2>Appointment Confirmed</h2>
        <p>Your appointment with Dr. ${doctor.name} has been confirmed</p>
        <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
        <p>Time: ${appointment.timeSlot.start} - ${appointment.timeSlot.end}</p>
        <p>Type: ${appointment.consultationType}</p>
      `;

      await NotificationService.sendEmail(
        doctor.email,
        'New Appointment',
        doctorEmailHtml
      );

      await NotificationService.sendEmail(
        patient.email,
        'Appointment Confirmed',
        patientEmailHtml
      );
    } catch (error) {
      console.error('Error sending appointment notifications:', error);
      throw error;
    }
  },

  // Notify about appointment reminder
  notifyAppointmentReminder: async (appointment) => {
    try {
      const doctor = await User.findById(appointment.doctor);
      const patient = await User.findById(appointment.patient);

      const reminderMessage = `Reminder: You have an appointment ${appointment.consultationType === 'video' ? 'video call' : 'consultation'} in 1 hour`;

      // Create notifications
      await NotificationService.createNotification(
        doctor._id,
        'reminder',
        'Appointment Reminder',
        reminderMessage,
        { appointmentId: appointment._id }
      );

      await NotificationService.createNotification(
        patient._id,
        'reminder',
        'Appointment Reminder',
        reminderMessage,
        { appointmentId: appointment._id }
      );

      // Send emails
      const emailHtml = `
        <h2>Appointment Reminder</h2>
        <p>${reminderMessage}</p>
        <p>Date: ${new Date(appointment.date).toLocaleDateString()}</p>
        <p>Time: ${appointment.timeSlot.start} - ${appointment.timeSlot.end}</p>
        <p>Type: ${appointment.consultationType}</p>
      `;

      await NotificationService.sendEmail(
        doctor.email,
        'Appointment Reminder',
        emailHtml
      );

      await NotificationService.sendEmail(
        patient.email,
        'Appointment Reminder',
        emailHtml
      );
    } catch (error) {
      console.error('Error sending reminder notifications:', error);
      throw error;
    }
  },

  // Notify about payment
  notifyPayment: async (payment, appointment) => {
    try {
      const doctor = await User.findById(appointment.doctor);
      const patient = await User.findById(appointment.patient);

      const paymentMessage = `Payment ${payment.status} for appointment with ${payment.status === 'completed' ? 'Dr. ' + doctor.name : patient.name}`;

      // Create notifications
      await NotificationService.createNotification(
        doctor._id,
        'payment',
        'Payment Update',
        paymentMessage,
        { paymentId: payment._id, appointmentId: appointment._id }
      );

      await NotificationService.createNotification(
        patient._id,
        'payment',
        'Payment Update',
        paymentMessage,
        { paymentId: payment._id, appointmentId: appointment._id }
      );

      // Send emails
      const emailHtml = `
        <h2>Payment Update</h2>
        <p>${paymentMessage}</p>
        <p>Amount: ${payment.amount} ${payment.currency}</p>
        <p>Date: ${new Date(payment.createdAt).toLocaleDateString()}</p>
      `;

      await NotificationService.sendEmail(
        doctor.email,
        'Payment Update',
        emailHtml
      );

      await NotificationService.sendEmail(
        patient.email,
        'Payment Update',
        emailHtml
      );
    } catch (error) {
      console.error('Error sending payment notifications:', error);
      throw error;
    }
  }
};

module.exports = NotificationService; 