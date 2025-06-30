import React, { useState, useEffect } from 'react';
import { FaSearch, FaClock, FaTag, FaBookmark, FaShare, FaArrowLeft, FaFilter } from 'react-icons/fa';

const healthGuides = {
  fever: {
    title: 'Fever Management Guide',
    category: 'Common Conditions',
    tags: ['Fever', 'Temperature', 'Home Care'],
    readingTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lastUpdated: '2024-03-15',
    symptoms: [
      'Elevated body temperature above 100.4°F (38°C)',
      'Chills and shivering',
      'Headache',
      'Muscle aches',
      'Loss of appetite',
      'Dehydration',
      'Sweating',
      'Weakness'
    ],
    homeRemedies: [
      'Rest and get plenty of sleep',
      'Stay hydrated - drink water, clear broths, or electrolyte solutions',
      'Take lukewarm baths or use cold compresses',
      'Dress in lightweight clothing',
      'Use over-the-counter fever reducers as directed',
      'Use a humidifier to add moisture to the air',
      'Eat light, easy-to-digest foods'
    ],
    whenToSeekHelp: [
      'Temperature above 103°F (39.4°C)',
      'Fever lasting more than 3 days',
      'Severe headache or stiff neck',
      'Difficulty breathing',
      'Seizures or confusion',
      'Rash or skin discoloration',
      'Severe vomiting or diarrhea'
    ]
  },
  cold: {
    title: 'Common Cold Guide',
    category: 'Respiratory Health',
    tags: ['Cold', 'Flu', 'Upper Respiratory'],
    readingTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lastUpdated: '2024-03-10',
    symptoms: [
      'Runny or stuffy nose',
      'Sore throat',
      'Cough',
      'Congestion',
      'Slight body aches',
      'Mild headache',
      'Low-grade fever',
      'Sneezing'
    ],
    homeRemedies: [
      'Get plenty of rest',
      'Stay hydrated with warm liquids',
      'Use saline nasal drops',
      'Gargle with warm salt water',
      'Use a humidifier',
      'Take over-the-counter cold medications',
      'Eat chicken soup or other warm broths'
    ],
    whenToSeekHelp: [
      'Symptoms lasting more than 10 days',
      'High fever (above 101.3°F)',
      'Severe sore throat',
      'Difficulty breathing',
      'Ear pain',
      'Severe headache',
      'Worsening symptoms'
    ]
  },
  headache: {
    title: 'Headache Management Guide',
    category: 'Pain Management',
    tags: ['Headache', 'Migraine', 'Pain Relief'],
    readingTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lastUpdated: '2024-03-12',
    symptoms: [
      'Pain in head or upper neck',
      'Sensitivity to light or sound',
      'Nausea',
      'Dizziness',
      'Visual disturbances',
      'Pressure or tightness in head',
      'Pain that worsens with movement',
      'Difficulty concentrating'
    ],
    homeRemedies: [
      'Rest in a quiet, dark room',
      'Apply cold or warm compresses',
      'Stay hydrated',
      'Practice relaxation techniques',
      'Maintain regular sleep schedule',
      'Take over-the-counter pain relievers',
      'Try gentle neck stretches',
      'Use essential oils (peppermint or lavender)'
    ],
    whenToSeekHelp: [
      'Sudden severe headache',
      'Headache with fever and stiff neck',
      'Headache after head injury',
      'Headache with confusion or seizures',
      'Headache with persistent vomiting',
      'Headache with weakness or numbness',
      'Headache that disrupts daily activities'
    ]
  },
  cough: {
    title: 'Cough Management Guide',
    category: 'Respiratory Health',
    tags: ['Cough', 'Throat', 'Respiratory'],
    readingTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lastUpdated: '2024-03-08',
    symptoms: [
      'Dry or wet cough',
      'Sore throat',
      'Chest congestion',
      'Difficulty breathing',
      'Fatigue',
      'Hoarseness',
      'Post-nasal drip',
      'Chest pain when coughing'
    ],
    homeRemedies: [
      'Stay hydrated with warm liquids',
      'Use a humidifier',
      'Try honey (for adults and children over 1 year)',
      'Gargle with warm salt water',
      'Elevate your head while sleeping',
      'Use over-the-counter cough medicines',
      'Try steam inhalation',
      'Avoid irritants like smoke and strong perfumes'
    ],
    whenToSeekHelp: [
      'Cough lasting more than 2 weeks',
      'Coughing up blood',
      'Difficulty breathing',
      'High fever',
      'Chest pain',
      'Unexplained weight loss',
      'Night sweats',
      'Wheezing or shortness of breath'
    ]
  }
};

const categories = [...new Set(Object.values(healthGuides).map(guide => guide.category))];
const allTags = [...new Set(Object.values(healthGuides).flatMap(guide => guide.tags))];

const HealthGuides = () => {
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const filteredGuides = Object.entries(healthGuides).filter(([key, guide]) => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = !selectedCategory || guide.category === selectedCategory;
    
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => guide.tags.includes(tag));

    return matchesSearch && matchesCategory && matchesTags;
  });

  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {!selectedGuide ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Health Guides</h1>
              <p className="text-lg text-gray-600">Expert medical information and self-care advice</p>
            </div>

            {/* Search and Filter Bar */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search guides..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FaFilter className="mr-2" />
                  Filters
                </button>
              </div>

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4 p-4 bg-white rounded-lg shadow-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Categories</h3>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category} className="flex items-center">
                            <input
                              type="radio"
                              name="category"
                              checked={selectedCategory === category}
                              onChange={() => setSelectedCategory(category)}
                              className="mr-2"
                            />
                            {category}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {allTags.map(tag => (
                          <button
                            key={tag}
                            onClick={() => handleTagToggle(tag)}
                            className={`px-3 py-1 rounded-full text-sm ${
                              selectedTags.includes(tag)
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGuides.map(([key, guide]) => (
                <div
                  key={key}
                  onClick={() => setSelectedGuide(key)}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                >
                  <div className="relative h-48">
                    <img
                      src={guide.image}
                      alt={guide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                        <FaBookmark className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {guide.category}
                      </span>
                      <span className="flex items-center text-gray-500 text-sm">
                        <FaClock className="mr-1" />
                        {guide.readingTime}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{guide.title}</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {guide.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(guide.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          // Selected Guide View
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedGuide(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
            >
              <FaArrowLeft className="mr-2" />
              Back to Guides
            </button>

            <article className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-64">
                <img
                  src={healthGuides[selectedGuide].image}
                  alt={healthGuides[selectedGuide].title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
                    {healthGuides[selectedGuide].category}
                  </span>
                  <span className="flex items-center text-gray-500">
                    <FaClock className="mr-2" />
                    {healthGuides[selectedGuide].readingTime}
                  </span>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {healthGuides[selectedGuide].title}
                </h1>

                <div className="flex flex-wrap gap-2 mb-6">
                  {healthGuides[selectedGuide].tags.map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="prose max-w-none">
                  <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Common Symptoms</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {healthGuides[selectedGuide].symptoms.map((symptom, index) => (
                        <li key={index} className="text-gray-700">{symptom}</li>
                      ))}
                    </ul>
                  </section>

                  <section className="mb-8">
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">Home Remedies</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {healthGuides[selectedGuide].homeRemedies.map((remedy, index) => (
                        <li key={index} className="text-gray-700">{remedy}</li>
                      ))}
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">When to Seek Medical Help</h2>
                    <ul className="list-disc pl-5 space-y-2">
                      {healthGuides[selectedGuide].whenToSeekHelp.map((warning, index) => (
                        <li key={index} className="text-red-600">{warning}</li>
                      ))}
                    </ul>
                  </section>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Last updated: {new Date(healthGuides[selectedGuide].lastUpdated).toLocaleDateString()}
                    </p>
                    <button className="flex items-center text-blue-600 hover:text-blue-800">
                      <FaShare className="mr-2" />
                      Share Guide
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthGuides; 