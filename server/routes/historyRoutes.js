const express = require('express');
const router = express.Router();
const { getTranscriptHistory } = require('../services/supabase');

router.get('/', async (req, res) => {
  try {
    const rows = await getTranscriptHistory();

    // Map DB rows -> UI shape your React expects
    const history = rows.map(r => ({
      id: r.id,
      filename: r.filename || 'Unknown',
      transcription: r.text || '',
      created_at: r.created_at,
    }));

    res.json(history);
  } catch (err) {
    console.error('GET /api/history error:', err?.response?.data || err.message || err);
    res.status(500).json({ error: 'Could not fetch history' });
  }
});

module.exports = router;
