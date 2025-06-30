import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';
import { 
  FaFileMedical, FaDownload, FaUpload, FaHistory, FaPrescriptionBottle, 
  FaNotesMedical, FaLock, FaEye, FaEyeSlash, FaSearch, FaFilter,
  FaFilePdf, FaFileImage, FaFileAlt, FaShieldAlt, FaCalendarAlt,
  FaUserMd, FaHospital, FaExclamationTriangle, FaTimes
} from 'react-icons/fa';

const HealthRecords = () => {
  useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [showPrivacyNotice, setShowPrivacyNotice] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/health-records');
      setRecords(response.data);
    } catch (err) {
      console.error('Error fetching health records:', err);
      setError(err.response?.data?.message || 'Failed to fetch health records. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('description', 'Uploaded medical record');
    formData.append('date', new Date().toISOString());

    try {
      setLoading(true);
      setError(null);
      await axios.post('/health-records', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchRecords();
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'image':
        return <FaFileImage className="text-blue-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || record.type === selectedType;
    const matchesYear = selectedYear === 'all' || new Date(record.date).getFullYear().toString() === selectedYear;
    return matchesSearch && matchesType && matchesYear;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-900">Loading your health records...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <FaExclamationTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold text-red-600">Error: {error}</h2>
            <p className="mt-2 text-gray-600">Please try again later or contact support if the problem persists.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <FaFileMedical className="text-blue-600 mr-3" />
            Health Records
          </h1>
          <p className="text-lg text-gray-600">
            Your complete medical history in one secure place
          </p>
        </div>

        {/* Privacy Notice */}
        {showPrivacyNotice && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8 rounded-lg shadow-sm">
            <div className="flex items-start">
              <FaShieldAlt className="text-blue-400 mt-1 mr-3" />
              <div className="flex-1">
                <p className="text-blue-700 font-medium">Your Privacy is Protected</p>
                <p className="text-blue-600 text-sm mt-1">
                  All your health records are encrypted and securely stored. Only authorized healthcare providers can access your information.
                </p>
              </div>
              <button
                onClick={() => setShowPrivacyNotice(false)}
                className="text-blue-400 hover:text-blue-500"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search records..."
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
            <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Record Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Types</option>
                    <option value="prescription">Prescriptions</option>
                    <option value="lab">Lab Results</option>
                    <option value="imaging">Imaging</option>
                    <option value="note">Clinical Notes</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('all')}
            >
              <FaFileMedical className="inline-block mr-2" />
              All Records
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'prescriptions'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('prescriptions')}
            >
              <FaPrescriptionBottle className="inline-block mr-2" />
              Prescriptions
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === 'lab'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('lab')}
            >
              <FaNotesMedical className="inline-block mr-2" />
              Lab Results
            </button>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecords.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FaFileMedical className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your health records will appear here once they are added.
              </p>
            </div>
          ) : (
            filteredRecords.map((record, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getFileIcon(record.fileType)}
                      <h3 className="ml-3 text-lg font-medium text-gray-900">
                        {record.title}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(record.date).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{record.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaUserMd className="mr-2" />
                      {record.doctor}
                    </div>
                    <div className="flex items-center">
                      <FaHospital className="mr-2" />
                      {record.hospital}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                      onClick={() => window.open(record.fileUrl, '_blank')}
                    >
                      <FaEye className="mr-2" />
                      View
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-800 flex items-center"
                      onClick={() => window.open(record.fileUrl, '_blank')}
                    >
                      <FaDownload className="mr-2" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upload Button */}
        <div className="mt-8 text-center">
          <label className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300">
            <FaUpload className="mr-2" />
            Upload New Record
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              accept=".pdf,.jpg,.jpeg,.png"
            />
          </label>
          <p className="mt-2 text-sm text-gray-500">
            Supported formats: PDF, JPG, PNG
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthRecords; 