import express from 'express';
import cors from 'cors';
import conversationsRouter from './routes/conversations.js';
import messagesRouter from './routes/messages.js';
import quickRepliesRouter from './routes/quickReplies.js';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - permitir todos los orígenes
app.use(cors());

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', mode: 'demo' });
});

// Routes
app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/quick-replies', quickRepliesRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
