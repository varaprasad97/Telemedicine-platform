import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
import { 
  FaUser, FaEnvelope, FaPhone, FaLock, FaBell, FaShieldAlt, FaHistory, 
  FaInfoCircle, FaCamera, FaSave, FaCheck, FaExclamationTriangle,
  FaUserMd, FaFileMedical, FaHeartbeat, FaCog, FaChevronRight
} from 'react-icons/fa';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [showTooltip, setShowTooltip] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    medicalHistory: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      appointmentReminders: true,
      prescriptionUpdates: true,
      healthTips: true,
      emergencyAlerts: true,
      marketingEmails: false
    },
    privacy: {
      shareMedicalHistory: false,
      shareLocation: false,
      allowDataCollection: true
    }
  });

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/users/profile');
      
      console.log('Profile response:', response.data);
      setUser(response.data);
      setFormData({
        ...formData,
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        medicalHistory: response.data.medicalHistory || ''
      });
    } catch (err) {
      console.error('Error fetching profile:', err.response || err);
      setError(err.response?.data?.message || 'Failed to fetch profile data');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      const response = await axios.put('/users/profile', {
        name: formData.name,
        phone: formData.phone,
        address: formData.address
      });

      console.log('Profile update response:', response.data);
      setSuccess('Profile updated successfully');
      setUser(response.data);
    } catch (err) {
      console.error('Error updating profile:', err.response || err);
      setError(err.response?.data?.message || 'Failed to update profile');
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      await axios.put('/users/password', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setSuccess('Password updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Error updating password:', err.response || err);
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleMedicalHistorySubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(null);
      const response = await axios.put('/users/medical-history', {
        medicalHistory: formData.medicalHistory
      });

      setSuccess('Medical history updated successfully');
      setUser(response.data);
    } catch (err) {
      console.error('Error updating medical history:', err.response || err);
      setError(err.response?.data?.message || 'Failed to update medical history');
    }
  };

  const handleNotificationChange = (key) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handlePrivacyChange = (key) => {
    setFormData(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  const handleSaveNotifications = async () => {
    try {
      setError(null);
      setSuccess(null);
      await axios.put('/users/notifications', { notifications: formData.notifications });
      setSuccess('Notification preferences updated successfully');
    } catch (err) {
      console.error('Error updating notifications:', err.response || err);
      setError(err.response?.data?.message || 'Failed to update notification preferences');
    }
  };

  const handleSavePrivacy = async () => {
    try {
      setError(null);
      setSuccess(null);
      await axios.put('/users/privacy', { privacy: formData.privacy });
      setSuccess('Privacy settings updated successfully');
    } catch (err) {
      console.error('Error updating privacy settings:', err.response || err);
      setError(err.response?.data?.message || 'Failed to update privacy settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                <FaUser className="text-4xl text-blue-500" />
              </div>
              <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                <FaCamera className="text-sm" />
              </button>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2 flex items-center space-x-2">
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Active
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {user?.role === 'doctor' ? 'Doctor' : 'Patient'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-lg flex items-center">
            <FaExclamationTriangle className="mr-2" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-lg flex items-center">
            <FaCheck className="mr-2" />
            {success}
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                activeTab === 'personal'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('personal')}
            >
              <FaUser className="mr-2" />
              Personal Information
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                activeTab === 'password'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('password')}
            >
              <FaLock className="mr-2" />
              Security
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                activeTab === 'medical'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('medical')}
            >
              <FaFileMedical className="mr-2" />
              Medical History
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                activeTab === 'notifications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('notifications')}
            >
              <FaBell className="mr-2" />
              Notifications
            </button>
            <button
              className={`flex items-center px-6 py-4 font-medium whitespace-nowrap ${
                activeTab === 'privacy'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('privacy')}
            >
              <FaShieldAlt className="mr-2" />
              Privacy
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          {/* Personal Information Form */}
          {activeTab === 'personal' && (
            <form onSubmit={handlePersonalInfoSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaSave className="mr-2" />
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Security Form */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaSave className="mr-2" />
                  Update Password
                </button>
              </div>
            </form>
          )}

          {/* Medical History Form */}
          {activeTab === 'medical' && (
            <form onSubmit={handleMedicalHistorySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History
                </label>
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="6"
                  placeholder="Enter your medical history, allergies, chronic conditions, etc."
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaSave className="mr-2" />
                  Update Medical History
                </button>
              </div>
            </form>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(formData.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaBell className="text-blue-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {key === 'appointmentReminders' && 'Get notified about upcoming appointments'}
                          {key === 'prescriptionUpdates' && 'Receive updates about your prescriptions'}
                          {key === 'healthTips' && 'Get personalized health tips and recommendations'}
                          {key === 'emergencyAlerts' && 'Receive important emergency notifications'}
                          {key === 'marketingEmails' && 'Receive promotional offers and updates'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handleNotificationChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSaveNotifications}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaSave className="mr-2" />
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div className="space-y-4">
                {Object.entries(formData.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <FaShieldAlt className="text-blue-500 mr-3" />
                      <div>
                        <h3 className="font-medium text-gray-800">
                          {key.split(/(?=[A-Z])/).join(' ')}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {key === 'shareMedicalHistory' && 'Allow doctors to access your medical history'}
                          {key === 'shareLocation' && 'Share your location for emergency services'}
                          {key === 'allowDataCollection' && 'Allow anonymous data collection for service improvement'}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={() => handlePrivacyChange(key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleSavePrivacy}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                >
                  <FaSave className="mr-2" />
                  Save Privacy Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile; 