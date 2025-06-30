import React, { useState } from 'react';
import axios from 'axios';

const OfflineMode = () => {
  const [phone, setPhone] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/symptoms/sms', { phone, symptoms });
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Error sending SMS');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Offline Mode</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number"
          className="w-full p-2 border rounded"
        />
        <label>
          <input type="checkbox" onChange={() => setSymptoms([...symptoms, 'fever'])} /> Fever
        </label>
        <label>
          <input type="checkbox" onChange={() => setSymptoms([...symptoms, 'cough'])} /> Cough
        </label>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Send SMS</button>
      </form>
      {message && <p className="mt-4">{message}</p>}
      <a href="/guides.pdf" download className="mt-4 inline-block text-blue-500">Download Health Guides</a>
    </div>
  );
};

export default OfflineMode;