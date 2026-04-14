import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_URL || 'https://mensaje-ghl-production.up.railway.app') + '/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const apiService = {
  // Conversations
  getConversations: async () => {
    const response = await api.get('/conversations');
    return response.data;
  },

  getConversationDetails: async (contactId) => {
    const response = await api.get(`/conversations/${contactId}`);
    return response.data;
  },

  // Messages
  getMessages: async (contactId, limit = 50) => {
    const response = await api.get(`/messages/${contactId}`, {
      params: { limit }
    });
    return response.data;
  },

  sendTextMessage: async (contactId, message) => {
    const response = await api.post('/messages/send-text', {
      contactId,
      message
    });
    return response.data;
  },

  sendMediaMessage: async (contactId, file, caption = '') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('contactId', contactId);
    formData.append('caption', caption);

    const response = await api.post('/messages/send-media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Quick Replies
  getQuickReplies: async () => {
    const response = await api.get('/quick-replies');
    return response.data;
  },

  createQuickReply: async (title, message) => {
    const response = await api.post('/quick-replies', {
      title,
      message
    });
    return response.data;
  },

  updateQuickReply: async (id, title, message) => {
    const response = await api.put(`/quick-replies/${id}`, {
      title,
      message
    });
    return response.data;
  },

  deleteQuickReply: async (id) => {
    const response = await api.delete(`/quick-replies/${id}`);
    return response.data;
  }
};
