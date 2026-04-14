import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

console.log(`Starting server on PORT: ${PORT}`);

app.use(cors());
app.use(express.json());

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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
  console.log('Responding to health check');
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get conversations
app.get('/api/conversations', (req, res) => {
  console.log('Responding with conversations');
  try {
    res.json(mockConversations);
  } catch (e) {
    console.error('Error in conversations route:', e);
    res.status(500).json({ error: e.message });
  }
});

// Get messages
app.get('/api/messages/:contactId', (req, res) => {
  const { contactId } = req.params;
  console.log('Responding with messages for contact:', contactId);
  try {
    const messages = mockMessages[contactId] || { data: [] };
    res.json(messages);
  } catch (e) {
    console.error('Error in messages route:', e);
    res.status(500).json({ error: e.message });
  }
});

// Send text
app.post('/api/messages/send-text', (req, res) => {
  const { contactId, message } = req.body;
  console.log('Sending text message to contact:', contactId, 'Message:', message);
  try {
    const newMessage = {
      id: Date.now().toString(),
      body: message,
      direction: 'outbound',
      dateAdded: new Date().toISOString()
    };

    // Add message to mockMessages
    if (!mockMessages[contactId]) {
      mockMessages[contactId] = { data: [] };
    }
    mockMessages[contactId].data.push(newMessage);

    res.json({ success: true, id: newMessage.id, message: newMessage });
  } catch (e) {
    console.error('Error in send-text route:', e);
    res.status(500).json({ error: e.message });
  }
});

// Send media
app.post('/api/messages/send-media', (req, res) => {
  console.log('Sending media');
  try {
    res.json({ success: true, id: Date.now().toString() });
  } catch (e) {
    console.error('Error in send-media route:', e);
    res.status(500).json({ error: e.message });
  }
});

// Quick replies
app.get('/api/quick-replies', (req, res) => {
  console.log('Responding with quick replies');
  try {
    res.json([]);
  } catch (e) {
    console.error('Error in quick-replies route:', e);
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/quick-replies', (req, res) => {
  console.log('Creating quick reply');
  try {
    res.json({ id: Date.now().toString(), ...req.body });
  } catch (e) {
    console.error('Error in create quick-reply route:', e);
    res.status(500).json({ error: e.message });
  }
});

// 404
app.use((req, res) => {
  console.log('404 for:', req.method, req.path);
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`✅ CORS enabled`);
  console.log(`✅ Ready to accept requests`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
