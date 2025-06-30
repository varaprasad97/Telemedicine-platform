const express = require('express');
const router = express.Router();
const { sendSMS } = require('../config/twilio');

// Mock SMS sending functionality
router.post('/sms', async (req, res) => {
  try {
    const { phone, symptoms } = req.body;
    
    // Format the phone number (add country code if not present)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
    
    // Create the message
    const message = `Your reported symptoms: ${symptoms.join(', ')}. A doctor will contact you shortly. Please stay hydrated and rest.`;
    
    // Send the SMS
    await sendSMS(formattedPhone, message);
    
    res.json({ 
      message: 'SMS sent successfully. A doctor will contact you shortly.' 
    });
  } catch (err) {
    console.error('SMS Error:', err);
    res.status(500).json({ 
      message: 'Failed to send SMS. Please try again later.',
      error: err.message 
    });
  }
});

module.exports = router; 