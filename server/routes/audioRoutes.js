// routes/audioRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // Use memory buffer
const { transcribeAudio } = require('../services/deepgram'); // ✅ Deepgram file
const { saveTranscript } = require('../services/supabase');

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);
    await saveTranscript(transcript, req.file.originalname);
    res.json({ transcript, filename: req.file.originalname });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

module.exports = router;
