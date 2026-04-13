import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const GHL_API_BASE = process.env.GHL_API_BASE || 'https://api.gohighlevel.com/v1';
const GHL_API_KEY = process.env.GHL_API_KEY;
const LOCATION_ID = process.env.GHL_LOCATION_ID;

if (!GHL_API_KEY || !LOCATION_ID) {
  console.warn('⚠️ GHL_API_KEY or GHL_LOCATION_ID not found. GHL API features will be disabled.');
}

const ghlClient = axios.create({
  baseURL: GHL_API_BASE,
  headers: {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const ghlService = {
  // Get list of conversations/contacts with SMS
  async getConversations() {
    try {
      const response = await ghlClient.get('/contacts', {
        params: {
          locationId: LOCATION_ID,
          limit: 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get messages for a specific conversation
  async getMessages(contactId, limit = 50) {
    try {
      const response = await ghlClient.get(`/contacts/${contactId}/timeline`, {
        params: {
          locationId: LOCATION_ID,
          limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error.response?.data || error.message);
      throw error;
    }
  },

  // Send SMS text message
  async sendMessage(contactId, message) {
    try {
      const response = await ghlClient.post('/conversations/messages', {
        locationId: LOCATION_ID,
        contactId,
        body: message,
        type: 'sms'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error.response?.data || error.message);
      throw error;
    }
  },

  // Upload media file (image or audio)
  async uploadMedia(file, contactId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('locationId', LOCATION_ID);
      formData.append('contactId', contactId);

      const response = await axios.post(
        `${GHL_API_BASE}/medias/upload-file`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${GHL_API_KEY}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading media:', error.response?.data || error.message);
      throw error;
    }
  },

  // Send message with media attachment
  async sendMessageWithMedia(contactId, mediaUrl, caption = '') {
    try {
      const response = await ghlClient.post('/conversations/messages', {
        locationId: LOCATION_ID,
        contactId,
        body: caption,
        attachments: [
          {
            url: mediaUrl,
            type: 'image' // or 'video', 'audio' depending on media type
          }
        ],
        type: 'sms'
      });
      return response.data;
    } catch (error) {
      console.error('Error sending media message:', error.response?.data || error.message);
      throw error;
    }
  },

  // Get contact details
  async getContact(contactId) {
    try {
      const response = await ghlClient.get(`/contacts/${contactId}`, {
        params: { locationId: LOCATION_ID }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching contact:', error.response?.data || error.message);
      throw error;
    }
  }
};
