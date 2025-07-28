const axios = require('axios');

/**
 * Transcribes audio using AssemblyAI from an in-memory Buffer.
 * @param {Buffer} audioBuffer - The audio file buffer.
 * @returns {Promise<string>} - The transcribed text.
 */
const transcribeAudio = async (audioBuffer) => {
  // Step 1: Upload the audio buffer to AssemblyAI
  const uploadRes = await axios.post(
    'https://api.assemblyai.com/v2/upload',
    audioBuffer,
    {
      headers: {
        'authorization': process.env.ASSEMBLYAI_API_KEY,
        'content-type': 'application/octet-stream'
      }
    }
  );

  const uploadUrl = uploadRes.data.upload_url;

  // Step 2: Request transcription
  const transcriptRes = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    { audio_url: uploadUrl },
    {
      headers: {
        authorization: process.env.ASSEMBLYAI_API_KEY,
        'content-type': 'application/json'
      }
    }
  );

  const transcriptId = transcriptRes.data.id;

  // Step 3: Poll until transcription is complete
  let transcript;
  while (true) {
    const polling = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
    );

    if (polling.data.status === 'completed') {
      transcript = polling.data.text;
      break;
    } else if (polling.data.status === 'error') {
      throw new Error(`Transcription failed: ${polling.data.error}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  return transcript;
};

module.exports = { transcribeAudio };
