import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Welcome from './components/Welcome';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Doctors from './components/Doctors';
import BookAppointment from './components/BookAppointment';
import Appointments from './components/Appointments';
import Profile from './components/Profile';
import VideoConsultation from './components/VideoConsultation';
import HealthRecords from './components/HealthRecords';
import SymptomChecker from './components/SymptomChecker';
import Emergency from './components/Emergency';
import HealthGuides from './components/HealthGuides';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <PrivateRoute>
                  <Doctors />
                </PrivateRoute>
              }
            />
            <Route
              path="/book-appointment"
              element={
                <PrivateRoute>
                  <BookAppointment />
                </PrivateRoute>
              }
            />
            <Route
              path="/appointments"
              element={
                <PrivateRoute>
                  <Appointments />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route
              path="/video-consultation/:appointmentId"
              element={
                <PrivateRoute>
                  <VideoConsultation />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-records"
              element={
                <PrivateRoute>
                  <HealthRecords />
                </PrivateRoute>
              }
            />
            <Route
              path="/symptom-checker"
              element={
                <PrivateRoute>
                  <SymptomChecker />
                </PrivateRoute>
              }
            />
            <Route
              path="/emergency"
              element={
                <PrivateRoute>
                  <Emergency />
                </PrivateRoute>
              }
            />
            <Route
              path="/health-guides"
              element={
                <PrivateRoute>
                  <HealthGuides />
                </PrivateRoute>
              }
            />
            <Route
              path="/video-consultation"
              element={
                <PrivateRoute>
                  <VideoConsultation />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
