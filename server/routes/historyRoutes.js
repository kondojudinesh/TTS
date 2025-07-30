// routes/historyRoutes.js
const express = require('express');
const router = express.Router();
const { getTranscriptHistory } = require('../services/supabase');

router.get('/', async (req, res) => {
  try {
    const rows = await getTranscriptHistory();
    res.json(rows); // ✅ raw format, frontend maps it
  } catch (err) {
    console.error('❌ Failed to get history:', err.message || err);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

module.exports = router;
