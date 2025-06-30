const mongoose = require('mongoose');

const doctorAvailabilitySchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dayOfWeek: {
    type: Number,
    required: true,
    min: 0, // Sunday
    max: 6  // Saturday
  },
  timeSlots: [{
    start: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time format (HH:MM)`
      }
    },
    end: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v);
        },
        message: props => `${props.value} is not a valid time format (HH:MM)`
      }
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  breakTime: [{
    start: String,
    end: String
  }]
}, { timestamps: true });

// Index for faster queries
doctorAvailabilitySchema.index({ doctor: 1, dayOfWeek: 1 });

// Method to check if a time slot is available
doctorAvailabilitySchema.methods.isTimeSlotAvailable = function(startTime, endTime) {
  return this.timeSlots.some(slot => 
    !slot.isBooked && 
    slot.start <= startTime && 
    slot.end >= endTime
  );
};

// Method to book a time slot
doctorAvailabilitySchema.methods.bookTimeSlot = function(startTime, endTime) {
  const slot = this.timeSlots.find(slot => 
    !slot.isBooked && 
    slot.start <= startTime && 
    slot.end >= endTime
  );
  
  if (slot) {
    slot.isBooked = true;
    return true;
  }
  return false;
};

module.exports = mongoose.model('DoctorAvailability', doctorAvailabilitySchema); 