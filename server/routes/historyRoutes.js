const express = require('express');
const router = express.Router();
const { getTranscriptHistory } = require('../services/supabase');

router.get('/', async (req, res) => {
  try {
    const history = await getTranscriptHistory();
    res.json(history);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch history' });
  }
});

module.exports = router;