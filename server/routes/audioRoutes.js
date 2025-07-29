const express = require('express');
const router = express.Router();
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
const { transcribeAudio } = require('../services/deepgram');
const { saveTranscript } = require('../services/supabase');

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    // 1) Validate input
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded (field name should be "audio").' });
    }
    if (!req.file.buffer || !req.file.mimetype) {
      return res.status(400).json({ error: 'Uploaded file is missing buffer or mimetype.' });
    }

    // 2) Log sizes/types for debugging
    console.log('📥 Received audio:', {
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // 3) Transcribe with Deepgram
    const transcriptText = await transcribeAudio(req.file.buffer, req.file.mimetype);

    // 4) Save in Supabase and get the inserted row back
    let row = null;
    try {
      row = await saveTranscript(transcriptText, req.file.originalname);
    } catch (dbErr) {
      console.error('⚠️ Failed to save transcript to DB:', dbErr);
      // Not fatal: we can still return the transcription without DB data
    }

    // 5) Respond in a shape your frontend expects
    //    Prefer values from DB row when available; otherwise fall back.
    return res.json({
      id: row?.id || null,
      filename: row?.filename || req.file.originalname,
      transcript: row?.text || transcriptText,   // client maps transcript -> transcription
      created_at: row?.created_at || new Date().toISOString(),
    });

  } catch (err) {
    console.error('❌ Transcription failed:', err?.response?.data || err.message || err);
    return res.status(500).json({
      error: 'Transcription failed',
      detail: err?.response?.data || err.message || 'Unknown server error',
    });
  }
});

module.exports = router;
