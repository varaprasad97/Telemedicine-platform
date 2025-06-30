import React, { useState, useEffect } from 'react';
import { FaRobot, FaTimes, FaExclamationTriangle, FaHistory, FaSearch, FaPlus, FaMinus, FaCalendarAlt, FaClock, FaUserMd, FaHospital, FaFileMedical, FaArrowRight, FaArrowLeft, FaCheck, FaQuestionCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AISymptomChecker = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [selectedBodyPart, setSelectedBodyPart] = useState(null);
  const [symptomHistory, setSymptomHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('checker');
  const [symptomTimeline, setSymptomTimeline] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [relatedGuides, setRelatedGuides] = useState([]);

  const steps = [
    { id: 1, title: 'Select Body Part', description: 'Choose the area where you\'re experiencing symptoms' },
    { id: 2, title: 'Select Symptoms', description: 'Select all symptoms that apply' },
    { id: 3, title: 'Duration & Severity', description: 'Tell us how long and how severe' },
    { id: 4, title: 'Additional Information', description: 'Any other details that might help' },
    { id: 5, title: 'Analysis', description: 'Get your AI-powered assessment' }
  ];

  const bodyParts = [
    { id: 'head', name: 'Head', icon: '🧠', symptoms: ['Headache', 'Dizziness', 'Fever', 'Nausea', 'Sinus Pain', 'Eye Pain', 'Ear Pain'] },
    { id: 'chest', name: 'Chest', icon: '❤️', symptoms: ['Chest Pain', 'Shortness of Breath', 'Cough', 'Heart Palpitations', 'Rib Pain', 'Back Pain'] },
    { id: 'abdomen', name: 'Abdomen', icon: '🤰', symptoms: ['Stomach Pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating', 'Loss of Appetite'] },
    { id: 'limbs', name: 'Limbs', icon: '💪', symptoms: ['Joint Pain', 'Muscle Pain', 'Swelling', 'Numbness', 'Tingling', 'Weakness', 'Stiffness'] }
  ];

  const severityLevels = [
    { value: 'mild', label: 'Mild', description: 'Noticeable but not interfering with daily activities' },
    { value: 'moderate', label: 'Moderate', description: 'Somewhat interfering with daily activities' },
    { value: 'severe', label: 'Severe', description: 'Significantly interfering with daily activities' }
  ];

  const durationOptions = [
    { value: 'hours', label: 'Hours' },
    { value: 'days', label: 'Days' },
    { value: 'weeks', label: 'Weeks' },
    { value: 'months', label: 'Months' }
  ];

  const findRelatedGuides = (symptoms) => {
    const guides = {
      fever: {
        title: 'Fever Management Guide',
        description: 'Learn about fever symptoms, home remedies, and when to seek medical help.',
        category: 'Common Conditions',
        tags: ['Fever', 'Temperature', 'Home Care'],
        readingTime: '5 min read'
      },
      cold: {
        title: 'Common Cold Guide',
        description: 'Comprehensive guide to managing cold symptoms and recovery.',
        category: 'Respiratory Health',
        tags: ['Cold', 'Flu', 'Upper Respiratory'],
        readingTime: '4 min read'
      },
      headache: {
        title: 'Headache Management Guide',
        description: 'Understanding different types of headaches and effective relief strategies.',
        category: 'Common Conditions',
        tags: ['Headache', 'Pain Management', 'Migraine'],
        readingTime: '6 min read'
      },
      cough: {
        title: 'Cough Relief Guide',
        description: 'Natural remedies and medical treatments for different types of cough.',
        category: 'Respiratory Health',
        tags: ['Cough', 'Respiratory', 'Home Remedies'],
        readingTime: '4 min read'
      }
    };

    const related = [];
    const symptomKeywords = symptoms.map(s => s.toLowerCase());

    Object.entries(guides).forEach(([key, guide]) => {
      const guideTags = guide.tags.map(tag => tag.toLowerCase());
      const hasMatch = symptomKeywords.some(symptom => 
        guideTags.some(tag => tag.includes(symptom) || symptom.includes(tag))
      );
      
      if (hasMatch) {
        related.push(guide);
      }
    });

    return related;
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis
    setTimeout(() => {
      const result = {
        severity: severity,
        conditions: [
          { name: 'Common Cold', probability: 75 },
          { name: 'Sinusitis', probability: 45 },
          { name: 'Allergic Rhinitis', probability: 30 }
        ],
        recommendations: [
          'Rest and stay hydrated',
          'Take over-the-counter pain relievers',
          'Use a humidifier',
          'Consider seeing a doctor if symptoms worsen'
        ]
      };
      setAnalysisResult(result);
      
      // Find related health guides
      const guides = findRelatedGuides(selectedSymptoms);
      setRelatedGuides(guides);
      
      setIsAnalyzing(false);
      
      // Add to history
      setSymptomHistory(prev => [{
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        symptoms: selectedSymptoms.join(', '),
        result
      }, ...prev]);
    }, 2000);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Where are you experiencing symptoms?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bodyParts.map(part => (
                <button
                  key={part.id}
                  onClick={() => {
                    setSelectedBodyPart(part);
                    handleNext();
                  }}
                  className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-4"
                >
                  <span className="text-4xl">{part.icon}</span>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900">{part.name}</h3>
                    <p className="text-sm text-gray-500">{part.symptoms.length} common symptoms</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select your symptoms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedBodyPart?.symptoms.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => toggleSymptom(symptom)}
                  className={`p-4 rounded-lg text-left transition-all ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">{symptom}</span>
                    {selectedSymptoms.includes(symptom) && (
                      <FaCheck className="text-blue-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={selectedSymptoms.length === 0}
                className={`flex items-center px-6 py-2 rounded-lg ${
                  selectedSymptoms.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How long and how severe?</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    min="1"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter number"
                  />
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select unit</option>
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                <div className="space-y-3">
                  {severityLevels.map(level => (
                    <button
                      key={level.value}
                      onClick={() => setSeverity(level.value)}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        severity === level.value
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-white border-2 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{level.label}</h3>
                          <p className="text-sm text-gray-500">{level.description}</p>
                        </div>
                        {severity === level.value && (
                          <FaCheck className="text-blue-500" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={!duration || !severity}
                className={`flex items-center px-6 py-2 rounded-lg ${
                  !duration || !severity
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                Next
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Any other symptoms or details that might help?
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows={4}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter any additional information about your symptoms..."
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <FaQuestionCircle className="text-blue-500 mt-1 mr-3" />
                  <div>
                    <h3 className="font-medium text-blue-900">Help us help you better</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      Include any relevant information such as:
                      • When did the symptoms start?
                      • Have you had similar symptoms before?
                      • Any recent injuries or changes in medication?
                      • Any other health conditions?
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <FaArrowLeft className="mr-2" />
                Back
              </button>
              <button
                onClick={() => {
                  handleNext();
                  handleAnalyze();
                }}
                className="flex items-center px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Analyze Symptoms
                <FaArrowRight className="ml-2" />
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            {isAnalyzing ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
                <h2 className="text-2xl font-semibold text-gray-800">Analyzing your symptoms...</h2>
                <p className="text-gray-600 mt-2">Our AI is processing your information</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-gray-800">Analysis Results</h2>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                    analysisResult.severity === 'severe' ? 'bg-red-100 text-red-600' :
                    analysisResult.severity === 'moderate' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-green-100 text-green-600'
                  }`}>
                    {analysisResult.severity.charAt(0).toUpperCase() + analysisResult.severity.slice(1)} Severity
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Possible Conditions</h3>
                    <div className="space-y-4">
                      {analysisResult.conditions.map(condition => (
                        <div key={condition.name} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium text-gray-700">{condition.name}</span>
                            <span className="text-blue-600 font-medium">{condition.probability}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${condition.probability}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      {analysisResult.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start bg-gray-50 rounded-lg p-4">
                          <FaUserMd className="text-blue-500 mt-1 mr-3" />
                          <span className="text-gray-700">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Related Health Guides</h3>
                  {relatedGuides.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {relatedGuides.map((guide, index) => (
                        <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{guide.title}</h4>
                            <span className="text-sm text-gray-500">{guide.readingTime}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {guide.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <Link
                            to={`/health-guides/${guide.title.toLowerCase().replace(/\s+/g, '-')}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center"
                          >
                            Read More
                            <FaArrowRight className="ml-1" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-gray-50 rounded-lg">
                      <p className="text-gray-600">No related health guides found</p>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                    Book Appointment
                  </button>
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Get Second Opinion
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <FaRobot className="text-blue-600 mr-3 animate-bounce" />
            AI Symptom Checker
          </h1>
          <p className="text-gray-600">Get instant medical insights powered by AI</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? <FaCheck /> : step.id}
                  </div>
                  <span className="text-xs mt-2 text-gray-600">{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-2 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Disclaimer Banner */}
        {showDisclaimer && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-lg shadow-sm">
            <div className="flex items-start">
              <FaExclamationTriangle className="text-yellow-400 mt-1 mr-3" />
              <div className="flex-1">
                <p className="text-yellow-700 font-medium">Medical Disclaimer</p>
                <p className="text-yellow-600 text-sm mt-1">
                  This AI symptom checker is for informational purposes only and should not replace professional medical advice.
                  Always consult with a healthcare provider for proper diagnosis and treatment.
                </p>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="text-yellow-400 hover:text-yellow-500"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {renderStepContent()}
        </div>
      </div>
    </div>
  );
};

export default AISymptomChecker; 