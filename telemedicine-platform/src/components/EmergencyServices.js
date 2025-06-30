import React, { useState, useEffect } from 'react';
import { FaAmbulance, FaPhone, FaMapMarkerAlt, FaUserMd, FaExclamationTriangle, FaHeartbeat, FaHospital, FaClock, FaInfoCircle, FaSos, FaLocationArrow, FaShieldAlt, FaUserFriends } from 'react-icons/fa';

const EmergencyServices = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  useEffect(() => {
    // Get user's location when component mounts
    getCurrentLocation();
    // Load emergency contacts from localStorage
    const savedContacts = localStorage.getItem('emergencyContacts');
    if (savedContacts) {
      setEmergencyContacts(JSON.parse(savedContacts));
    }
  }, []);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    }
  };

  const emergencyServices = [
    {
      id: 'ambulance',
      title: 'Emergency Ambulance',
      description: 'Immediate medical transport to nearest hospital',
      icon: <FaAmbulance className="text-4xl text-red-500" />,
      responseTime: '5-10 minutes',
      contact: '911',
      color: 'from-red-500 to-red-600'
    },
    {
      id: 'doctor',
      title: 'Emergency Doctor',
      description: 'Immediate video consultation with emergency physician',
      icon: <FaUserMd className="text-4xl text-blue-500" />,
      responseTime: '2-3 minutes',
      contact: '911',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'hospital',
      title: 'Nearest Hospital',
      description: 'Find and navigate to the nearest emergency room',
      icon: <FaHospital className="text-4xl text-green-500" />,
      responseTime: 'Real-time',
      contact: '911',
      color: 'from-green-500 to-green-600'
    }
  ];

  const handleEmergencyCall = (service) => {
    setSelectedService(service);
    setShowConfirmation(true);
  };

  const confirmEmergency = () => {
    // Here you would implement the actual emergency call logic
    window.location.href = `tel:${selectedService.contact}`;
  };

  const activateSOS = () => {
    setIsSOSActive(true);
    // Implement SOS logic here - notify emergency contacts, emergency services, etc.
    setTimeout(() => {
      setIsSOSActive(false);
    }, 10000); // Reset after 10 seconds
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* SOS Button - Fixed at top */}
      <button
        onClick={activateSOS}
        className={`fixed top-4 right-4 z-50 p-4 rounded-full shadow-lg transition-all transform hover:scale-105 ${
          isSOSActive
            ? 'bg-red-600 animate-pulse'
            : 'bg-red-500 hover:bg-red-600'
        }`}
      >
        <FaSos className="text-2xl" />
      </button>

      <div className="container mx-auto px-4 py-8">
        {/* Emergency Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaExclamationTriangle className="text-6xl text-red-500 animate-pulse" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
            Emergency Services
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Immediate assistance available 24/7. Select the service you need and we'll connect you right away.
          </p>
        </div>

        {/* Location Status */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FaLocationArrow className="text-2xl text-blue-400" />
                <div>
                  <h3 className="text-lg font-semibold">Your Location</h3>
                  <p className="text-gray-400">
                    {isLoadingLocation
                      ? 'Getting your location...'
                      : userLocation
                      ? 'Location detected'
                      : 'Location not available'}
                  </p>
                </div>
              </div>
              <button
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Refresh Location
              </button>
            </div>
          </div>
        </div>

        {/* Emergency Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {emergencyServices.map((service) => (
            <div
              key={service.id}
              className={`bg-gradient-to-br ${service.color} rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105`}
            >
              <div className="flex items-center justify-between mb-4">
                {service.icon}
                <span className="text-sm text-white/80 flex items-center">
                  <FaClock className="mr-1" />
                  {service.responseTime}
                </span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-white/80 mb-4">{service.description}</p>
              <button
                onClick={() => handleEmergencyCall(service)}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <FaPhone />
                <span>Call Now</span>
              </button>
            </div>
          ))}
        </div>

        {/* Emergency Information */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <FaInfoCircle className="mr-2 text-blue-400" />
              Important Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FaHeartbeat className="mr-2 text-red-400" />
                  Emergency Symptoms
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Severe chest pain</li>
                  <li>• Difficulty breathing</li>
                  <li>• Sudden severe pain</li>
                  <li>• Uncontrolled bleeding</li>
                  <li>• Loss of consciousness</li>
                  <li>• Seizures</li>
                </ul>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="font-semibold mb-2 flex items-center">
                  <FaShieldAlt className="mr-2 text-blue-400" />
                  Safety Tips
                </h3>
                <ul className="text-gray-300 space-y-2">
                  <li>• Stay calm and provide clear information</li>
                  <li>• Keep your phone line open</li>
                  <li>• Follow emergency responder instructions</li>
                  <li>• Have someone wait outside to guide help</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <FaUserFriends className="mr-2 text-blue-400" />
              Emergency Contacts
            </h2>
            {emergencyContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact, index) => (
                  <div key={index} className="bg-gray-700 rounded-lg p-4">
                    <h3 className="font-semibold">{contact.name}</h3>
                    <p className="text-gray-300">{contact.phone}</p>
                    <p className="text-gray-400 text-sm">{contact.relationship}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No emergency contacts added yet.</p>
            )}
          </div>
        </div>

        {/* Emergency Call Confirmation Modal */}
        {showConfirmation && selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4 animate-pulse" />
                <h3 className="text-2xl font-semibold mb-2">Confirm Emergency Call</h3>
                <p className="text-gray-400">
                  You are about to call {selectedService.title}. This will connect you to emergency services.
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmEmergency}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
                >
                  Call Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyServices; 