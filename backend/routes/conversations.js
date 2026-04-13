import express from 'express';
import { ghlService } from '../services/ghlService.js';
import { IS_DEMO_MODE } from '../server.js';
import { mockConversations } from '../mockData.js';

const router = express.Router();

// Get all conversations/contacts
router.get('/', async (req, res) => {
  try {
    if (IS_DEMO_MODE) {
      return res.json(mockConversations);
    }
    const conversations = await ghlService.getConversations();
    res.json(conversations);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations', details: error.message });
  }
});

// Get single conversation/contact details
router.get('/:contactId', async (req, res) => {
  try {
    const { contactId } = req.params;

    if (IS_DEMO_MODE) {
      const contact = mockConversations.contacts.find(c => c.id === contactId);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      return res.json(contact);
    }

    const contact = await ghlService.getContact(contactId);
    res.json(contact);
  } catch (error) {
    console.error('Route error:', error);
    res.status(500).json({ error: 'Failed to fetch contact', details: error.message });
  }
});

export default router;
