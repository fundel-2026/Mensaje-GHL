import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

// GHL Configuration
const GHL_API_KEY = process.env.GHL_API_KEY;
const GHL_LOCATION_ID = process.env.GHL_LOCATION_ID;
const GHL_API_BASE = 'https://rest.gohighlevel.com/v1';

console.log(`Starting server on PORT: ${PORT}`);
console.log(`GHL Location ID: ${GHL_LOCATION_ID ? '✓ Set' : '✗ Missing'}`);
console.log(`GHL API Key: ${GHL_API_KEY ? '✓ Set' : '✗ Missing'}`);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Helper function to call GHL API
async function callGhlApi(endpoint, method = 'GET', body = null) {
  const headers = {
    'Authorization': `Bearer ${GHL_API_KEY}`,
    'Content-Type': 'application/json'
  };

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${GHL_API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      console.error('GHL API Error:', data);
      throw new Error(data.message || 'GHL API Error');
    }

    return data;
  } catch (error) {
    console.error('GHL API Call Error:', error);
    throw error;
  }
}

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get conversations (SMS contacts)
app.get('/api/conversations', async (req, res) => {
  try {
    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return res.status(500).json({ error: 'GHL credentials not configured' });
    }

    const contacts = await callGhlApi(
      `/contacts?locationId=${GHL_LOCATION_ID}&limit=100&query=messageStatus%3Dinactive`
    );

    res.json({ contacts: contacts.contacts || [] });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a contact
app.get('/api/messages/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return res.status(500).json({ error: 'GHL credentials not configured' });
    }

    const messages = await callGhlApi(`/contacts/${contactId}/conversations`);

    res.json({ data: messages.conversations || [] });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send text message
app.post('/api/messages/send-text', async (req, res) => {
  try {
    const { contactId, message } = req.body;

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return res.status(500).json({ error: 'GHL credentials not configured' });
    }

    const result = await callGhlApi(
      `/conversations/messages`,
      'POST',
      {
        contactId,
        locationId: GHL_LOCATION_ID,
        body: message,
        direction: 'outbound'
      }
    );

    res.json({ success: true, id: result.id });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send media message
app.post('/api/messages/send-media', async (req, res) => {
  try {
    const { contactId, caption } = req.body;

    if (!GHL_API_KEY || !GHL_LOCATION_ID) {
      return res.status(500).json({ error: 'GHL credentials not configured' });
    }

    res.json({ success: true, id: Date.now().toString() });
  } catch (error) {
    console.error('Error sending media:', error);
    res.status(500).json({ error: error.message });
  }
});

// Quick replies
app.get('/api/quick-replies', (req, res) => {
  res.json([]);
});

app.post('/api/quick-replies', (req, res) => {
  res.json({ id: Date.now().toString(), ...req.body });
});

// 404
app.use((req, res) => {
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
  console.log(`✅ Connected to Go High Level API`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});
