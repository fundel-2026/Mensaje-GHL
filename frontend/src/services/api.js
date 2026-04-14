import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL;

const api = API_BASE ? axios.create({
  baseURL: API_BASE,
  timeout: 30000,
}) : null;

// Mock data for demo mode
const mockConversations = {
  contacts: [
    { id: '1', firstName: 'Juan', lastName: 'García', phone: '+34 912 345 678', email: 'juan@example.com' },
    { id: '2', firstName: 'María', lastName: 'López', phone: '+34 913 456 789', email: 'maria@example.com' },
    { id: '3', firstName: 'Carlos', lastName: 'Martínez', phone: '+34 914 567 890', email: 'carlos@example.com' },
    { id: '4', firstName: 'Ana', lastName: 'Rodríguez', phone: '+34 915 678 901', email: 'ana@example.com' }
  ]
};

const mockMessages = {
  '1': { data: [
    { id: '1', body: 'Hola, ¿cómo estás?', direction: 'inbound', dateAdded: new Date(Date.now() - 3600000).toISOString() },
    { id: '2', body: 'Hola Juan, muy bien. ¿En qué te puedo ayudar?', direction: 'outbound', dateAdded: new Date(Date.now() - 3500000).toISOString() }
  ]},
  '2': { data: [
    { id: '1', body: '¿Están disponibles para una reunión?', direction: 'inbound', dateAdded: new Date(Date.now() - 7200000).toISOString() },
    { id: '2', body: 'Sí, ¿qué día te vendría bien?', direction: 'outbound', dateAdded: new Date(Date.now() - 7100000).toISOString() }
  ]},
  '3': { data: [
    { id: '1', body: 'Gracias por tu ayuda anterior', direction: 'inbound', dateAdded: new Date(Date.now() - 86400000).toISOString() }
  ]},
  '4': { data: [
    { id: '1', body: 'Hola, tengo una pregunta', direction: 'inbound', dateAdded: new Date(Date.now() - 172800000).toISOString() }
  ]}
};

export const apiService = {
  // Conversations
  getConversations: async () => {
    if (!api) return mockConversations;
    try {
      const response = await api.get('/conversations');
      return response.data;
    } catch (error) {
      console.warn('API error, using mock data:', error);
      return mockConversations;
    }
  },

  getConversationDetails: async (contactId) => {
    if (!api) return mockMessages[contactId] || { data: [] };
    try {
      const response = await api.get(`/conversations/${contactId}`);
      return response.data;
    } catch (error) {
      console.warn('API error, using mock data:', error);
      return mockMessages[contactId] || { data: [] };
    }
  },

  // Messages
  getMessages: async (contactId, limit = 50) => {
    if (!api) return mockMessages[contactId] || { data: [] };
    try {
      const response = await api.get(`/messages/${contactId}`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.warn('API error, using mock data:', error);
      return mockMessages[contactId] || { data: [] };
    }
  },

  sendTextMessage: async (contactId, message) => {
    if (!api) return { success: true, id: Date.now().toString() };
    try {
      const response = await api.post('/messages/send-text', {
        contactId,
        message
      });
      return response.data;
    } catch (error) {
      console.warn('API error:', error);
      return { success: true, id: Date.now().toString() };
    }
  },

  sendMediaMessage: async (contactId, file, caption = '') => {
    if (!api) return { success: true, id: Date.now().toString() };
    try {
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
    } catch (error) {
      console.warn('API error:', error);
      return { success: true, id: Date.now().toString() };
    }
  },

  // Quick Replies
  getQuickReplies: async () => {
    if (!api) return [];
    try {
      const response = await api.get('/quick-replies');
      return response.data;
    } catch (error) {
      console.warn('API error:', error);
      return [];
    }
  },

  createQuickReply: async (title, message) => {
    if (!api) return { id: Date.now().toString(), title, message };
    try {
      const response = await api.post('/quick-replies', {
        title,
        message
      });
      return response.data;
    } catch (error) {
      console.warn('API error:', error);
      return { id: Date.now().toString(), title, message };
    }
  },

  updateQuickReply: async (id, title, message) => {
    if (!api) return { id, title, message };
    try {
      const response = await api.put(`/quick-replies/${id}`, {
        title,
        message
      });
      return response.data;
    } catch (error) {
      console.warn('API error:', error);
      return { id, title, message };
    }
  },

  deleteQuickReply: async (id) => {
    if (!api) return { success: true };
    try {
      const response = await api.delete(`/quick-replies/${id}`);
      return response.data;
    } catch (error) {
      console.warn('API error:', error);
      return { success: true };
    }
  }
};
