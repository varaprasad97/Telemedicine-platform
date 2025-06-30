const twilio = require('twilio');
const config = require('../config/config');

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const VideoService = {
  // Generate access token for video room
  generateToken: (identity, roomName) => {
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY,
      process.env.TWILIO_API_SECRET
    );

    token.identity = identity;
    const grant = new VideoGrant({ room: roomName });
    token.addGrant(grant);

    return token.toJwt();
  },

  // Create a new video room
  createRoom: async (roomName) => {
    try {
      const room = await client.video.rooms.create({
        uniqueName: roomName,
        type: 'go',
        recordParticipantsOnConnect: true
      });
      return room;
    } catch (error) {
      console.error('Error creating video room:', error);
      throw error;
    }
  },

  // End a video room
  endRoom: async (roomName) => {
    try {
      const room = await client.video.rooms(roomName).update({ status: 'completed' });
      return room;
    } catch (error) {
      console.error('Error ending video room:', error);
      throw error;
    }
  },

  // Get room status
  getRoomStatus: async (roomName) => {
    try {
      const room = await client.video.rooms(roomName).fetch();
      return room;
    } catch (error) {
      console.error('Error getting room status:', error);
      throw error;
    }
  }
};

module.exports = VideoService; 