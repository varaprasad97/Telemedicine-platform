require('dotenv').config();

module.exports = {
  // Server Configuration
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/telemedicine',

  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: '24h',

  // Cookie Configuration
  COOKIE_SECURE: process.env.NODE_ENV === 'production',
  COOKIE_HTTP_ONLY: true,
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours

  // Email Configuration (for future use)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,

  // File Upload Configuration (for future use)
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'uploads',
  MAX_FILE_SIZE: process.env.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB
}; 