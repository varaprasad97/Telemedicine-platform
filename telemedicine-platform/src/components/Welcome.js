import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Welcome = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to TeleMedicine Platform
          </h1>
          <p className="text-xl mb-8">
            Your trusted platform for virtual healthcare consultations
          </p>
          
          {!user ? (
            <div className="space-x-4">
              <Link
                to="/login"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition duration-300"
              >
                Register
              </Link>
            </div>
          ) : (
            <div className="space-x-4">
              <Link
                to="/dashboard"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:bg-blue-50 transition duration-300"
              >
                Go to Dashboard
              </Link>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Virtual Consultations</h3>
            <p className="text-gray-600">
              Connect with healthcare professionals from the comfort of your home
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">24/7 Support</h3>
            <p className="text-gray-600">
              Access medical assistance anytime, anywhere
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Secure Platform</h3>
            <p className="text-gray-600">
              Your health information is protected with advanced security measures
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 