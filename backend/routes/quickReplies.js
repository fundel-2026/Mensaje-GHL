import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const QUICK_REPLIES_FILE = './quickReplies.json';

// Initialize quick replies file if it doesn't exist
function initializeQuickReplies() {
  if (!fs.existsSync(QUICK_REPLIES_FILE)) {
    fs.writeFileSync(QUICK_REPLIES_FILE, JSON.stringify([], null, 2));
  }
}

// Read quick replies
function readQuickReplies() {
  initializeQuickReplies();
  const data = fs.readFileSync(QUICK_REPLIES_FILE, 'utf-8');
  return JSON.parse(data);
}

// Write quick replies
function writeQuickReplies(replies) {
  fs.writeFileSync(QUICK_REPLIES_FILE, JSON.stringify(replies, null, 2));
}

// Get all quick replies
router.get('/', (req, res) => {
  try {
    const replies = readQuickReplies();
    res.json(replies);
  } catch (error) {
    console.error('Error reading quick replies:', error);
    res.status(500).json({ error: 'Failed to fetch quick replies' });
  }
});

// Create new quick reply
router.post('/', (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Missing title or message' });
    }

    const replies = readQuickReplies();
    const newReply = {
      id: Date.now().toString(),
      title,
      message,
      createdAt: new Date().toISOString()
    };

    replies.push(newReply);
    writeQuickReplies(replies);

    res.status(201).json(newReply);
  } catch (error) {
    console.error('Error creating quick reply:', error);
    res.status(500).json({ error: 'Failed to create quick reply' });
  }
});

// Update quick reply
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ error: 'Missing title or message' });
    }

    const replies = readQuickReplies();
    const index = replies.findIndex(r => r.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Quick reply not found' });
    }

    replies[index] = {
      ...replies[index],
      title,
      message,
      updatedAt: new Date().toISOString()
    };

    writeQuickReplies(replies);
    res.json(replies[index]);
  } catch (error) {
    console.error('Error updating quick reply:', error);
    res.status(500).json({ error: 'Failed to update quick reply' });
  }
});

// Delete quick reply
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const replies = readQuickReplies();
    const filtered = replies.filter(r => r.id !== id);

    if (filtered.length === replies.length) {
      return res.status(404).json({ error: 'Quick reply not found' });
    }

    writeQuickReplies(filtered);
    res.json({ success: true, message: 'Quick reply deleted' });
  } catch (error) {
    console.error('Error deleting quick reply:', error);
    res.status(500).json({ error: 'Failed to delete quick reply' });
  }
});

export default router;
