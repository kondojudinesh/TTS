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
      size: req.file.size
    });

    // 3) Call Deepgram
    const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);

    // 4) Persist (optional – adjust to your schema)
    try {
      await saveTranscript(transcript, req.file.originalname);
    } catch (dbErr) {
      console.error('⚠️ Failed to save transcript to DB:', dbErr);
      // Not fatal for the API response; we still return the transcript
    }

    // 5) Respond with what the frontend expects
    return res.json({
      transcript,
      filename: req.file.originalname
    });

  } catch (err) {
    // 6) Show the real reason in logs and return a readable message to the client
    console.error('❌ Transcription failed:', err.response?.data || err.message || err);
    return res.status(500).json({
      error: 'Transcription failed',
      detail: err.response?.data || err.message || 'Unknown server error'
    });
  }
});

module.exports = router;
