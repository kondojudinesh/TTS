// services/deepgram.js
const axios = require('axios');

/**
 * Transcribe audio using Deepgram API
 * @param {Buffer} audioBuffer - The uploaded audio buffer
 * @param {string} mimetype - The audio MIME type (e.g., audio/webm)
 * @returns {Promise<string>} - Transcribed text
 */
const transcribeAudio = async (audioBuffer, mimetype) => {
  const response = await axios.post(
    'https://api.deepgram.com/v1/listen',
    audioBuffer,
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': mimetype, // e.g., audio/webm or audio/mp3
      }
    }
  );

  const transcript = response.data.results.channels[0].alternatives[0].transcript;
  return transcript || '[No transcription]';
};

module.exports = { transcribeAudio };
