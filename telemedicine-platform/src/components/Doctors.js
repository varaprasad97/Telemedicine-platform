import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaStar, FaSearch, FaClock, FaMapMarkerAlt, FaFilter, FaVideo, FaCalendarAlt, FaGraduationCap, FaLanguage } from 'react-icons/fa';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedRating, setSelectedRating] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const doctorImages = useMemo(() => [
    'https://randomuser.me/api/portraits/men/1.jpg',
    'https://randomuser.me/api/portraits/women/1.jpg',
    'https://randomuser.me/api/portraits/men/2.jpg',
    'https://randomuser.me/api/portraits/women/2.jpg',
    'https://randomuser.me/api/portraits/men/3.jpg',
    'https://randomuser.me/api/portraits/women/3.jpg'
  ], []);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/doctors');
      
      if (!response.data || response.data.length === 0) {
        // If no doctors found, add sample doctors
        await axios.post('/doctors/add-sample');
        const newResponse = await axios.get('/doctors');
        response.data = newResponse.data;
      }
      
      // Add random images and placeholder data for demonstration
      const doctorsWithImages = response.data.map((doctor, index) => ({
        ...doctor,
        image: doctorImages[index % doctorImages.length],
        available: Math.random() > 0.3,
        rating: (4 + Math.random()).toFixed(1),
        experience: `${Math.floor(Math.random() * 20) + 5} years`,
        languages: ['English', 'Spanish', 'French', 'German', 'Hindi'].slice(0, Math.floor(Math.random() * 3) + 1),
        location: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)],
        nextAvailable: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
      }));
      
      setDoctors(doctorsWithImages);
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError(err.response?.data?.message || 'Failed to fetch doctors. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [doctorImages]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const specialties = useMemo(() => {
    return [...new Set(doctors.map(doctor => doctor.specialty))];
  }, [doctors]);

  const languages = useMemo(() => {
    return [...new Set(doctors.flatMap(doctor => doctor.languages))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
      const matchesRating = !selectedRating || parseFloat(doctor.rating) >= parseFloat(selectedRating);
      const matchesLanguage = !selectedLanguage || doctor.languages.includes(selectedLanguage);
      return matchesSearch && matchesSpecialty && matchesRating && matchesLanguage;
    });
  }, [doctors, searchTerm, selectedSpecialty, selectedRating, selectedLanguage]);

  const handleBookAppointment = (doctorId) => {
    navigate(`/book-appointment/${doctorId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading doctors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchDoctors}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Find Your Doctor</h1>
          <p className="text-lg text-gray-600">Connect with qualified healthcare professionals</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name, specialty, or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <FaSearch className="absolute left-4 top-4 text-gray-400 text-lg" />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaFilter className="mr-2" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Specialties</option>
                  {specialties.map((specialty, index) => (
                    <option key={index} value={specialty}>{specialty}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Languages</option>
                  {languages.map((language, index) => (
                    <option key={index} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div 
              key={doctor._id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900">{doctor.name}</h3>
                    <p className="text-blue-600 font-medium">{doctor.specialty}</p>
                    <div className="flex items-center mt-1">
                      <FaStar className="text-yellow-400 mr-1" />
                      <span className="text-gray-700 font-medium">{doctor.rating}</span>
                      <span className="text-gray-500 text-sm ml-2">({doctor.experience})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-600">
                    <FaMapMarkerAlt className="mr-2 text-gray-400" />
                    <span>{doctor.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2 text-gray-400" />
                    <span>Next Available: {doctor.nextAvailable}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaLanguage className="mr-2 text-gray-400" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                </div>

                <div className="mt-6 flex space-x-3">
                  <button
                    onClick={() => handleBookAppointment(doctor._id)}
                    disabled={!doctor.available}
                    className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                      doctor.available
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    } transition-colors`}
                  >
                    <FaCalendarAlt className="mr-2" />
                    {doctor.available ? 'Book Now' : 'Not Available'}
                  </button>
                  {doctor.available && (
                    <button
                      onClick={() => navigate(`/video-consultation/${doctor._id}`)}
                      className="flex-1 py-2 px-4 rounded-lg bg-green-500 text-white hover:bg-green-600 flex items-center justify-center space-x-2 transition-colors"
                    >
                      <FaVideo className="mr-2" />
                      Video Call
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <p className="text-gray-600 text-lg">No doctors found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialty('');
                setSelectedRating('');
                setSelectedLanguage('');
              }}
              className="mt-4 text-blue-500 hover:text-blue-600 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors; 