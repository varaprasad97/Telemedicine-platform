import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to TeleMedicine Platform',
      login: 'Login',
      register: 'Register',
      dashboard: 'Dashboard',
      findDoctors: 'Find Doctors',
      appointments: 'Appointments',
      healthRecords: 'Health Records',
      symptomChecker: 'Symptom Checker',
      emergency: 'Emergency',
      profile: 'Profile'
    }
  },
  te: { translation: { welcome: 'టెలిమెడిసిన్‌కు స్వాగతం', premium: 'ప్రీమియంకు అప్‌గ్రేడ్ చేయండి' } },
  hi: { translation: { welcome: 'टेलीमेडिसिन में आपका स्वागत है', premium: 'प्रीमियम में अपग्रेड करें' } },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;