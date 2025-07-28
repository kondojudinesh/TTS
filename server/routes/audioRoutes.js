const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // ✅ Stores in memory
const { transcribeAudio } = require('../services/assembly');
const { saveTranscript } = require('../services/supabase');

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const audioBuffer = req.file.buffer;
    const transcript = await transcribeAudio(audioBuffer);
    await saveTranscript(transcript, req.file.originalname);
    res.json({
  transcript,
  filename: req.file.originalname
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

module.exports = router;
