import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conversationsRouter from './routes/conversations.js';
import messagesRouter from './routes/messages.js';
import quickRepliesRouter from './routes/quickReplies.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Always use demo mode for now
export const IS_DEMO_MODE = true;

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/conversations', conversationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/quick-replies', quickRepliesRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    mode: IS_DEMO_MODE ? 'DEMO (usando datos de prueba)' : 'PRODUCCIÓN (conectado a GHL)'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📱 API base: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);

  if (IS_DEMO_MODE) {
    console.log('\n⚠️  MODO DEMOSTRACIÓN ACTIVO');
    console.log('📊 Usando datos de prueba');
    console.log('Para conectar con Go High Level, configura:');
    console.log('   - GHL_API_KEY en tu archivo .env');
    console.log('   - GHL_LOCATION_ID en tu archivo .env');
  } else {
    console.log('\n✅ Conectado a Go High Level API');
  }
});
