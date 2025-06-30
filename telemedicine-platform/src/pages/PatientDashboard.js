import React from 'react';
import { useTranslation } from 'react-i18next';
import VideoCall from '../components/VideoCall';
import DoctorDirectory from '../components/DoctorDirectory';
import SymptomChecker from '../components/SymptomChecker';
import OfflineMode from '../components/OfflineMode';

const PatientDashboard = () => {
  const { t, i18n } = useTranslation();
  const isPremium = false; // Simulate premium status

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('welcome')}</h2>
      <div className="mb-4">
        <button onClick={() => i18n.changeLanguage('en')} className="mr-2 bg-blue-500 text-white py-1 px-3 rounded">English</button>
        <button onClick={() => i18n.changeLanguage('te')} className="mr-2 bg-blue-500 text-white py-1 px-3 rounded">Telugu</button>
        <button onClick={() => i18n.changeLanguage('hi')} className="bg-blue-500 text-white py-1 px-3 rounded">Hindi</button>
      </div>
      <DoctorDirectory />
      <SymptomChecker />
      <OfflineMode />
      {isPremium ? <VideoCall roomId="room1" /> : <p className="mt-4">{t('premium')} for video consultations</p>}
    </div>
  );
};

export default PatientDashboard;