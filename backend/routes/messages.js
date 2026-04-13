import express from 'express';
import multer from 'multer';
import { ghlService } from '../services/ghlService.js';
import { IS_DEMO_MODE } from '../server.js';
import { mockMessages } from '../mockData.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = './uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Get messages for a conversation
router.get('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;
    const { limit = 50 } = req.query;

    if (IS_DEMO_MODE) {
      const messages = mockMessages[contactId] || { data: [] };
      return res.json(messages);
    }

    const messages = await ghlService.getMessages(contactId, parseInt(limit));
    res.json(messages);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Failed to fetch messages', details: error.message });
  }
});

// Send text message
router.post('/send-text', async (req, res) => {
  try {
    const { contactId, message } = req.body;

    if (!contactId || !message) {
      return res.status(400).json({ error: 'Missing contactId or message' });
    }

    if (IS_DEMO_MODE) {
      // In demo mode, just return success
      return res.json({
        success: true,
        message: 'Mensaje enviado (modo demo)',
        id: Date.now().toString(),
        contactId,
        body: message,
        dateAdded: new Date().toISOString(),
        direction: 'outbound'
      });
    }

    const result = await ghlService.sendMessage(contactId, message);
    res.json(result);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Failed to send message', details: error.message });
  }
});

// Send message with image/audio
router.post('/send-media', upload.single('file'), async (req, res) => {
  try {
    const { contactId, caption = '', mediaType = 'image' } = req.body;

    if (!contactId || !req.file) {
      return res.status(400).json({ error: 'Missing contactId or file' });
    }

    const filePath = req.file.path;

    if (IS_DEMO_MODE) {
      // Clean up local file
      fs.unlinkSync(filePath);
      // In demo mode, just return success
      return res.json({
        success: true,
        message: 'Archivo enviado (modo demo)',
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
    }

    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);

    // Create form data for GHL upload
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('file', fileBuffer, req.file.originalname);
    formData.append('locationId', process.env.GHL_LOCATION_ID);

    // Upload to GHL
    const uploadResponse = await ghlService.uploadMedia(req.file, contactId);
    const mediaUrl = uploadResponse.url || uploadResponse.mediaUrl;

    // Send message with media
    const messageResult = await ghlService.sendMessageWithMedia(contactId, mediaUrl, caption);

    // Clean up local file
    fs.unlinkSync(filePath);

    res.json(messageResult);
  } catch (error) {
    console.error('Route error:', error);
    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to send media', details: error.message });
  }
});

export default router;
