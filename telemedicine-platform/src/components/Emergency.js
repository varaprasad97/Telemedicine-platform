import React, { useState } from 'react';
import { FaPhone, FaAmbulance, FaHospital, FaExclamationTriangle } from 'react-icons/fa';

const Emergency = () => {
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    // In a real application, this would trigger emergency services
    // and notify nearby hospitals
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            Emergency Services
          </h1>
          <p className="text-lg text-gray-600">
            Get immediate assistance in case of emergency
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <FaPhone className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              Emergency Hotline
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Call our 24/7 emergency hotline
            </p>
            <a
              href="tel:911"
              className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              911
            </a>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <FaAmbulance className="h-12 w-12 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-2">
              Request Ambulance
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Get immediate medical transport
            </p>
            <a
              href="tel:911"
              className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Call Ambulance
            </a>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Emergency Alert</h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Your Location
                </label>
                <input
                  type="text"
                  id="location"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Enter your current location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Emergency Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Describe the emergency situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
                >
                  <FaExclamationTriangle className="mr-2" />
                  Send Emergency Alert
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <FaHospital className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Emergency Alert Sent
              </h3>
              <p className="text-gray-600">
                Help is on the way. Please stay calm and follow the instructions
                provided by emergency services.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 bg-yellow-50 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">
            Important Information
          </h3>
          <ul className="list-disc list-inside text-yellow-700 space-y-2">
            <li>Stay calm and provide clear information</li>
            <li>Keep your phone line open for emergency services</li>
            <li>Follow the instructions given by emergency responders</li>
            <li>If possible, have someone wait outside to guide emergency services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Emergency; 