const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

// Enhanced symptom database with more conditions and recommendations
const symptomDatabase = {
  fever: {
    conditions: ['Common Cold', 'Flu', 'COVID-19', 'Pneumonia', 'Urinary Tract Infection', 'Sinusitis'],
    recommendations: [
      'Rest and stay hydrated',
      'Take over-the-counter fever reducers',
      'Monitor temperature regularly',
      'Use cold compresses',
      'Take lukewarm baths',
      'Wear lightweight clothing',
      'Seek medical attention if fever persists or is very high'
    ]
  },
  cough: {
    conditions: ['Common Cold', 'Flu', 'COVID-19', 'Bronchitis', 'Asthma', 'Post-nasal Drip', 'GERD'],
    recommendations: [
      'Stay hydrated with warm liquids',
      'Use a humidifier',
      'Take over-the-counter cough medicine',
      'Try honey (for adults and children over 1 year)',
      'Avoid irritants like smoke',
      'Elevate your head while sleeping',
      'Use saline nasal drops'
    ]
  },
  headache: {
    conditions: ['Migraine', 'Tension Headache', 'Sinusitis', 'Cluster Headache', 'Dehydration', 'Eye Strain'],
    recommendations: [
      'Rest in a quiet, dark room',
      'Take over-the-counter pain relievers',
      'Stay hydrated',
      'Apply cold or warm compress',
      'Practice relaxation techniques',
      'Maintain regular sleep schedule',
      'Consider using essential oils'
    ]
  },
  cold: {
    conditions: ['Common Cold', 'Sinusitis', 'Allergic Rhinitis', 'Flu'],
    recommendations: [
      'Get plenty of rest',
      'Stay hydrated with warm liquids',
      'Use saline nasal drops',
      'Take over-the-counter cold medications',
      'Use a humidifier',
      'Gargle with warm salt water',
      'Eat chicken soup or other warm broths'
    ]
  },
  sore_throat: {
    conditions: ['Pharyngitis', 'Tonsillitis', 'Strep Throat', 'Common Cold', 'Flu'],
    recommendations: [
      'Gargle with warm salt water',
      'Stay hydrated',
      'Use throat lozenges',
      'Take over-the-counter pain relievers',
      'Use a humidifier',
      'Avoid irritants like smoke',
      'Rest your voice'
    ]
  },
  fatigue: {
    conditions: ['Anemia', 'Depression', 'Chronic Fatigue Syndrome', 'Sleep Apnea', 'Thyroid Disorders'],
    recommendations: [
      'Get adequate sleep',
      'Maintain a balanced diet',
      'Exercise regularly',
      'Stay hydrated',
      'Manage stress',
      'Take regular breaks',
      'Consider consulting a doctor if fatigue persists'
    ]
  },
  nausea: {
    conditions: ['Gastritis', 'Food Poisoning', 'Motion Sickness', 'Pregnancy', 'Migraine'],
    recommendations: [
      'Stay hydrated with small sips of water',
      'Eat small, bland meals',
      'Avoid strong smells',
      'Rest in a quiet environment',
      'Try ginger tea or candies',
      'Avoid lying down after eating',
      'Take deep breaths'
    ]
  },
  diarrhea: {
    conditions: ['Gastroenteritis', 'Food Poisoning', 'Irritable Bowel Syndrome', 'Lactose Intolerance'],
    recommendations: [
      'Stay hydrated with electrolyte solutions',
      'Eat bland foods (BRAT diet)',
      'Avoid dairy and fatty foods',
      'Rest and avoid strenuous activity',
      'Take over-the-counter anti-diarrheal medication',
      'Wash hands frequently',
      'Seek medical attention if symptoms persist'
    ]
  }
};

// Analyze symptoms
router.post('/analyze', auth, async (req, res) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms) {
      return res.status(400).json({ msg: 'Please provide symptoms' });
    }

    // Tokenize and process the input text
    const tokens = tokenizer.tokenize(symptoms.toLowerCase());
    
    // Find matching symptoms in the database
    const matchedSymptoms = Object.keys(symptomDatabase).filter(symptom =>
      tokens.some(token => token.includes(symptom))
    );

    if (matchedSymptoms.length === 0) {
      return res.status(400).json({ msg: 'No recognized symptoms found' });
    }

    // Collect all possible conditions and recommendations
    const conditions = new Set();
    const recommendations = new Set();

    matchedSymptoms.forEach(symptom => {
      symptomDatabase[symptom].conditions.forEach(condition => conditions.add(condition));
      symptomDatabase[symptom].recommendations.forEach(recommendation => recommendations.add(recommendation));
    });

    // Add severity assessment
    const severity = matchedSymptoms.length >= 3 ? 'high' : 
                    matchedSymptoms.length >= 2 ? 'medium' : 'low';

    res.json({
      conditions: Array.from(conditions),
      recommendations: Array.from(recommendations),
      severity,
      matchedSymptoms,
      message: severity === 'high' ? 
        'You have multiple symptoms. Please consider consulting a doctor soon.' :
        severity === 'medium' ?
        'Monitor your symptoms and seek medical attention if they worsen.' :
        'Your symptoms appear mild. Try the recommended remedies and seek help if symptoms persist.'
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router; 