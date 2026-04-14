import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Demo data inline
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

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Get conversations
app.get('/api/conversations', (req, res) => {
  console.log('GET /api/conversations');
  res.json(mockConversations);
});

// Get messages
app.get('/api/messages/:contactId', (req, res) => {
  const { contactId } = req.params;
  console.log('GET /api/messages/:' + contactId);
  const messages = mockMessages[contactId] || { data: [] };
  res.json(messages);
});

// Send text
app.post('/api/messages/send-text', (req, res) => {
  console.log('POST /api/messages/send-text');
  res.json({ success: true, id: Date.now().toString() });
});

// Send media
app.post('/api/messages/send-media', (req, res) => {
  console.log('POST /api/messages/send-media');
  res.json({ success: true, id: Date.now().toString() });
});

// Quick replies
app.get('/api/quick-replies', (req, res) => {
  console.log('GET /api/quick-replies');
  res.json([]);
});

app.post('/api/quick-replies', (req, res) => {
  console.log('POST /api/quick-replies');
  res.json({ id: Date.now().toString(), ...req.body });
});

// Start
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
