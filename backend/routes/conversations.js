import express from 'express';

const router = express.Router();

// Demo data
const mockConversations = {
  contacts: [
    {
      id: '1',
      firstName: 'Juan',
      lastName: 'García',
      phone: '+34 912 345 678',
      email: 'juan@example.com'
    },
    {
      id: '2',
      firstName: 'María',
      lastName: 'López',
      phone: '+34 913 456 789',
      email: 'maria@example.com'
    },
    {
      id: '3',
      firstName: 'Carlos',
      lastName: 'Martínez',
      phone: '+34 914 567 890',
      email: 'carlos@example.com'
    },
    {
      id: '4',
      firstName: 'Ana',
      lastName: 'Rodríguez',
      phone: '+34 915 678 901',
      email: 'ana@example.com'
    }
  ]
};

// Get all conversations/contacts
router.get('/', (req, res) => {
  res.json(mockConversations);
});

// Get single conversation/contact details
router.get('/:contactId', (req, res) => {
  const { contactId } = req.params;
  const contact = mockConversations.contacts.find(c => c.id === contactId);

  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  res.json(contact);
});

export default router;
