import express from 'express';
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Demo data
const mockMessages = {
  '1': {
    data: [
      {
        id: '1',
        body: 'Hola, ¿cómo estás?',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '2',
        body: 'Hola Juan, muy bien. ¿En qué te puedo ayudar?',
        direction: 'outbound',
        dateAdded: new Date(Date.now() - 3500000).toISOString()
      }
    ]
  },
  '2': {
    data: [
      {
        id: '1',
        body: '¿Están disponibles para una reunión?',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '2',
        body: 'Sí, ¿qué día te vendría bien?',
        direction: 'outbound',
        dateAdded: new Date(Date.now() - 7100000).toISOString()
      }
    ]
  },
  '3': {
    data: [
      {
        id: '1',
        body: 'Gracias por tu ayuda anterior',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  },
  '4': {
    data: [
      {
        id: '1',
        body: 'Hola, tengo una pregunta',
        direction: 'inbound',
        dateAdded: new Date(Date.now() - 172800000).toISOString()
      }
    ]
  }
};

// Get messages for a conversation
router.get('/:contactId', (req, res) => {
  const { contactId } = req.params;
  const messages = mockMessages[contactId] || { data: [] };
  res.json(messages);
});

// Send text message
router.post('/send-text', (req, res) => {
  const { contactId, message } = req.body;
  res.json({
    success: true,
    message: 'Mensaje enviado',
    id: Date.now().toString(),
    contactId,
    body: message,
    dateAdded: new Date().toISOString(),
    direction: 'outbound'
  });
});

// Send message with image/audio
router.post('/send-media', upload.single('file'), (req, res) => {
  const { contactId, caption = '', mediaType = 'image' } = req.body;
  res.json({
    success: true,
    message: 'Archivo enviado',
    id: Date.now().toString(),
    contactId,
    body: caption || '(Archivo compartido)',
    attachments: [
      {
        url: `demo-media-${Date.now()}`,
        type: mediaType
      }
    ],
    dateAdded: new Date().toISOString(),
    direction: 'outbound'
  });
});

export default router;
