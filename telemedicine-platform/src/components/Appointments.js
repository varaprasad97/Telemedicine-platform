import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaClock, FaVideo, FaTimes } from 'react-icons/fa';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [appointments, setAppointments] = useState({ upcoming: [], past: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/appointments');
      
      // Separate appointments into upcoming and past
      const now = new Date();
      const upcoming = response.data.filter(apt => 
        new Date(apt.date) >= now && apt.status !== 'cancelled'
      );
      const past = response.data.filter(apt => 
        new Date(apt.date) < now || apt.status === 'cancelled'
      );

      setAppointments({ upcoming, past });
    } catch (err) {
      console.error('Error fetching appointments:', err);
      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to fetch appointments. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await axios.delete(`/appointments/${id}`);
      // Refresh appointments after cancellation
      fetchAppointments();
    } catch (err) {
      setError('Failed to cancel appointment. Please try again.');
      console.error('Error cancelling appointment:', err);
    }
  };

  const handleBookAppointment = () => {
    navigate('/book-appointment');
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    // Convert 24-hour format to 12-hour format with AM/PM
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={fetchAppointments}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Appointments</h1>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'upcoming'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'past'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {appointments[activeTab].length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-lg">
              <p className="text-gray-600">No {activeTab} appointments found.</p>
            </div>
          ) : (
            appointments[activeTab].map(appointment => (
              <div key={appointment._id} className="bg-white rounded-lg shadow-lg p-6 transition-shadow hover:shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {appointment.doctor?.name || 'Doctor information not available'}
                    </h2>
                    <p className="text-gray-600">{appointment.doctor?.specialty || 'Specialty not available'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'scheduled'
                      ? 'bg-green-100 text-green-800'
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-gray-600">
                    <FaCalendarAlt className="mr-2" />
                    <span>{new Date(appointment.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaClock className="mr-2" />
                    <span>
                      {formatTime(appointment.timeSlot?.start)} - {formatTime(appointment.timeSlot?.end)}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <FaVideo className="mr-2" />
                    <span>{appointment.consultationType || 'Not specified'}</span>
                  </div>
                </div>

                {appointment.status === 'scheduled' && (
                  <div className="flex justify-end space-x-4">
                    {appointment.consultationType === 'video' && appointment.meetingLink && (
                      <button
                        onClick={() => window.open(appointment.meetingLink, '_blank')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <FaVideo className="mr-2" />
                        Join Meeting
                      </button>
                    )}
                    <button
                      onClick={() => cancelAppointment(appointment._id)}
                      className={`flex items-center ${
                        activeTab === 'past' 
                          ? 'text-gray-600 hover:text-gray-800 cursor-not-allowed opacity-50'
                          : 'text-red-600 hover:text-red-800 transition-colors'
                      }`}
                      disabled={activeTab === 'past'}
                      title={activeTab === 'past' ? 'Cannot cancel past appointments' : 'Cancel Appointment'}
                    >
                      <FaTimes className="mr-2" />
                      {activeTab === 'past' ? 'Cancelled' : 'Cancel Appointment'}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Book New Appointment Button */}
        {activeTab === 'upcoming' && (
          <div className="mt-6 text-center">
            <button 
              onClick={handleBookAppointment}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center justify-center mx-auto hover:bg-blue-600 transition-colors"
            >
              <FaCalendarAlt className="mr-2" />
              Book New Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments; 