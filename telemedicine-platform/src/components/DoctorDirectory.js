import React, { useState } from 'react';
import { FaUserMd, FaStar, FaVideo, FaCalendarAlt } from 'react-icons/fa';

const DoctorDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');

  // Mock data for doctors
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      rating: 4.8,
      experience: '15 years',
      available: true,
      image: 'https://randomuser.me/api/portraits/women/1.jpg'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Neurology',
      rating: 4.9,
      experience: '12 years',
      available: true,
      image: 'https://randomuser.me/api/portraits/men/2.jpg'
    },
    {
      id: 3,
      name: 'Dr. Emily Brown',
      specialty: 'Pediatrics',
      rating: 4.7,
      experience: '10 years',
      available: false,
      image: 'https://randomuser.me/api/portraits/women/3.jpg'
    },
    {
      id: 4,
      name: 'Dr. James Wilson',
      specialty: 'Dermatology',
      rating: 4.6,
      experience: '8 years',
      available: true,
      image: 'https://randomuser.me/api/portraits/men/4.jpg'
    }
  ];

  const specialties = ['all', 'Cardiology', 'Neurology', 'Pediatrics', 'Dermatology'];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Find a Doctor</h1>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>
                  {specialty === 'all' ? 'All Specialties' : specialty}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <div key={doctor.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={doctor.image}
                    alt={doctor.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{doctor.name}</h2>
                    <p className="text-gray-600">{doctor.specialty}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-gray-700">{doctor.rating}</span>
                  <span className="text-gray-500 ml-2">({doctor.experience} experience)</span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <FaVideo className="mr-2" />
                    Video Call
                  </button>
                  <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-600 transition-colors">
                    <FaCalendarAlt className="mr-2" />
                    Book
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                    doctor.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {doctor.available ? 'Available Now' : 'Not Available'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDirectory;