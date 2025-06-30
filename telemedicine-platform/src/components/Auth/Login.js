import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(formData.email, formData.password);
      navigate(user.role === 'patient' ? '/patient-dashboard' : '/doctor-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          onChange={handleChange} 
          className="w-full p-2 border rounded" 
          required 
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded w-full">Login</button>
      </form>
      <div className="mt-4 text-center">
        <p className="text-gray-600">Don't have an account?</p>
        <Link to="/register" className="text-blue-500 hover:text-blue-700">Register here</Link>
      </div>
    </div>
  );
};

export default Login;