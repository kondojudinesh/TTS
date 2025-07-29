const axios = require('axios');

/**
 * Transcribe audio using Deepgram API
 * @param {Buffer} audioBuffer  - The uploaded audio buffer
 * @param {string} mimetype     - e.g. 'audio/webm', 'audio/mpeg', 'audio/wav'
 * @returns {Promise<string>}   - Transcribed text
 */
const transcribeAudio = async (audioBuffer, mimetype) => {
  // Helpful sanity checks
  if (!process.env.DEEPGRAM_API_KEY) {
    throw new Error('Missing DEEPGRAM_API_KEY env var on the server.');
  }
  if (!audioBuffer || !Buffer.isBuffer(audioBuffer)) {
    throw new Error('Invalid or empty audio buffer.');
  }
  if (!mimetype) {
    throw new Error('Missing mimetype for uploaded audio.');
  }

  try {
    // Deepgram supports raw audio bytes + Content-Type header
    // Add model and formatting options via query params for better output
    const url = 'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true';

    const response = await axios.post(url, audioBuffer, {
      headers: {
        Authorization: `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': mimetype
      },
      // If your files are larger, consider increasing the timeout:
      timeout: 120000, // 120s
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
    });

    // Inspect the shape to avoid undefined access
    const transcript =
      response?.data?.results?.channels?.[0]?.alternatives?.[0]?.transcript || '';

    return transcript || '[No transcription]';

  } catch (err) {
    // Bubble up detailed info for the route to log
    throw err;
  }
};

module.exports = { transcribeAudio };
