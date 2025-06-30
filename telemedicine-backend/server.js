require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Set JWT secret if not in environment variables
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-secret-key-here';
}

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const appointmentRoutes = require('./routes/appointments');
const videoRoutes = require('./routes/video');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');
const healthRecordsRoutes = require('./routes/healthRecords');
const symptomCheckerRoutes = require('./routes/symptomChecker');
const emergencyRoutes = require('./routes/emergency');
const medicalRecordsRoutes = require('./routes/medical-records');
const aiRoutes = require('./routes/ai');
const symptomsRoutes = require('./routes/symptoms');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId, userId) => {
    console.log(`User ${userId} joining room ${roomId}`);
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', userId);

    socket.on('disconnect', () => {
      socket.to(roomId).emit('user-disconnected', userId);
    });
  });

  socket.on('signal', ({ userId, callerId, signal }) => {
    io.to(userId).emit('signal', { userId: callerId, signal });
  });
});

// MongoDB Connection
const MONGODB_URI = 'mongodb://127.0.0.1:27017/telemedicine';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  retryWrites: true,
  w: 'majority'
})
  .then(() => {
    console.log('MongoDB Connected Successfully');
    // Start server only after successful database connection
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1); // Exit if cannot connect to database
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/health-records', healthRecordsRoutes);
app.use('/api/symptom-checker', symptomCheckerRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/symptoms', symptomsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}); 