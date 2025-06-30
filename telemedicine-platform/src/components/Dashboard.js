import React from 'react';
import { Link } from 'react-router-dom';
import { FaVideo, FaBriefcaseMedical, FaUserCog, FaUserMd, FaBookMedical, FaStethoscope, FaFileMedical, FaNotesMedical, FaPhoneVolume } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Find Doctors',
      description: 'Browse our network of qualified healthcare professionals',
      icon: <FaUserMd className="text-green-600 text-3xl mb-3" />,
      link: '/doctors'
    },
    {
      title: 'Video Consultation',
      description: 'Start a video call with your doctor',
      icon: <FaVideo className="text-purple-600 text-3xl mb-3" />,
      link: '/video-consultation'
    },
    {
      title: 'Emergency',
      description: 'Get immediate help',
      icon: <FaBriefcaseMedical className="text-red-600 text-3xl mb-3" />,
      link: '/emergency'
    },
    {
      title: 'Profile Settings',
      description: 'Manage your account',
      icon: <FaUserCog className="text-indigo-600 text-3xl mb-3" />,
      link: '/profile'
    },
    {
      title: 'Health Guides',
      description: 'Access comprehensive health guides and information',
      icon: <FaBookMedical className="text-teal-600 text-3xl mb-3" />,
      link: '/health-guides'
    },
    {
      title: 'Symptom Checker',
      description: 'Check your symptoms and get preliminary medical advice before consulting a doctor.',
      icon: <FaStethoscope className="text-red-600 text-3xl mb-3" />,
      link: '/symptom-checker'
    },
    {
      title: 'Medical Records',
      description: 'Access your complete medical history, prescriptions, and test results in one secure place.',
      icon: <FaFileMedical className="text-purple-600 text-3xl mb-3" />,
      link: '/health-records'
    },
    {
      title: 'My Appointments',
      description: 'View and manage your upcoming and past appointments with healthcare providers.',
      icon: <FaNotesMedical className="text-orange-600 text-3xl mb-3" />,
      link: '/appointments'
    },
    {
      title: 'Emergency Services',
      description: 'Quick access to emergency services and nearby hospitals in case of urgent medical needs.',
      icon: <FaPhoneVolume className="text-red-600 text-3xl mb-3" />,
      link: '/emergency'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {user?.name}</h1>
      
      <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 block"
          >
            <div className="flex items-center mb-3">
              {action.icon}
              <h3 className="text-xl font-semibold ml-4">{action.title}</h3>
            </div>
            <p className="text-gray-600 text-sm">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 