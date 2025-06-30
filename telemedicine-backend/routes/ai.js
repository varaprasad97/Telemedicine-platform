const express = require('express');
const router = express.Router();

// Valid symptoms and their corresponding conditions
const validSymptoms = {
  fever: {
    conditions: ['Common cold', 'Flu', 'Viral infection'],
    recommendations: 'Rest, stay hydrated, and monitor temperature. Take fever reducers if needed.'
  },
  cough: {
    conditions: ['Common cold', 'Bronchitis', 'Respiratory infection'],
    recommendations: 'Stay hydrated, use cough drops, and avoid irritants.'
  },
  headache: {
    conditions: ['Tension headache', 'Migraine', 'Sinus infection'],
    recommendations: 'Rest in a dark, quiet room. Stay hydrated and avoid triggers.'
  }
};

// Simple symptom prediction with validation
router.post('/predict', (req, res) => {
  try {
    const { symptoms } = req.body;
    
    // Validate symptoms
    const invalidSymptoms = symptoms.filter(symptom => !validSymptoms[symptom]);
    if (invalidSymptoms.length > 0) {
      return res.status(400).json({ 
        error: 'Invalid symptoms detected',
        invalidSymptoms: invalidSymptoms,
        message: 'Please only select from the available symptoms: fever, cough, headache'
      });
    }

    // Get unique conditions and recommendations for all symptoms
    const conditions = new Set();
    const recommendations = new Set();
    
    symptoms.forEach(symptom => {
      validSymptoms[symptom].conditions.forEach(condition => conditions.add(condition));
      recommendations.add(validSymptoms[symptom].recommendations);
    });

    // Generate prediction
    let prediction = 'Based on your symptoms, you may have:\n';
    prediction += Array.from(conditions).join(', ') + '.\n\n';
    prediction += 'Recommendations:\n';
    prediction += Array.from(recommendations).join('\n');

    // Add severity assessment
    if (symptoms.length >= 2) {
      prediction += '\n\nSince you have multiple symptoms, please consider consulting a doctor if symptoms persist or worsen.';
    }

    res.json({ result: prediction });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 