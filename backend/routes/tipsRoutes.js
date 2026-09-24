const express = require('express');
const router = express.Router();
const db = require('../utils/db');

// Get all tips
router.get('/', (req, res) => {
  db.all('SELECT * FROM tips ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get active tip (latest)
router.get('/active', (req, res) => {
  db.get('SELECT * FROM tips WHERE is_active = 1 ORDER BY created_at DESC LIMIT 1', [], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(row || {});
  });
});

// Create tip
router.post('/', (req, res) => {
  const { title, content, created_by } = req.body;

  db.run(
    'INSERT INTO tips (title, content, created_by) VALUES (?, ?, ?)',
    [title, content, created_by],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, message: 'Tip created successfully' });
    }
  );
});

// Delete tip
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM tips WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ message: 'Tip deleted successfully' });
  });
});

module.exports = router;