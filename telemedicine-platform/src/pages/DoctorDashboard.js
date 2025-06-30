import React from 'react';
import { useTranslation } from 'react-i18next';
import VideoCall from '../components/VideoCall';

const DoctorDashboard = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('welcome')}</h2>
      <div className="mb-4">
        <button onClick={() => i18n.changeLanguage('en')} className="mr-2 bg-blue-500 text-white py-1 px-3 rounded">English</button>
        <button onClick={() => i18n.changeLanguage('te')} className="mr-2 bg-blue-500 text-white py-1 px-3 rounded">Telugu</button>
        <button onClick={() => i18n.changeLanguage('hi')} className="bg-blue-500 text-white py-1 px-3 rounded">Hindi</button>
      </div>
      <VideoCall roomId="room1" />
    </div>
  );
};

export default DoctorDashboard;