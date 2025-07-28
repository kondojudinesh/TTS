// services/deepgram.js
const axios = require('axios');
const FormData = require('form-data');

/**
 * Transcribe audio using Deepgram API
 * @param {Buffer} audioBuffer - The uploaded audio buffer
 * @param {string} mimetype - The audio MIME type (e.g., audio/webm)
 * @returns {Promise<string>} - Transcribed text
 */
const transcribeAudio = async (audioBuffer, mimetype) => {
  const form = new FormData();
  form.append('audio', audioBuffer, {
    filename: 'audio-file',
    contentType: mimetype
  });

  const response = await axios.post(
    'https://api.deepgram.com/v1/listen',
    audioBuffer,
    {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': mimetype,
      }
    }
  );

  const transcript = response.data.results.channels[0].alternatives[0].transcript;
  return transcript || '[No transcription]';
};

module.exports = { transcribeAudio };
