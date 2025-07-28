const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() }); // ✅ Stores file in memory
const { transcribeAudio } = require('../services/assembly');
const { saveTranscript } = require('../services/supabase');

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const transcript = await transcribeAudio(req.file.buffer); // ✅ Use buffer from memory
    await saveTranscript(transcript, req.file.originalname);   // ✅ Save with original name
    res.json({
      transcript,
      filename: req.file.originalname
    });
  } catch (err) {
    console.error('❌ Error during transcription:', err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

module.exports = router;
