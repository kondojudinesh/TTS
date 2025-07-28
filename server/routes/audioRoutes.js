const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { transcribeAudio } = require('../services/assembly');
const { saveTranscript } = require('../services/supabase');

router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const filePath = req.file.path;
    const transcript = await transcribeAudio(filePath);
    await saveTranscript(transcript, req.file.originalname);
    res.json({ transcript });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Transcription failed' });
  }
});

module.exports = router;
