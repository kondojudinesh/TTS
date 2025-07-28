const axios = require('axios');

/**
 * Transcribes audio using AssemblyAI from an in-memory Buffer.
 * @param {Buffer} audioBuffer - The audio file buffer.
 * @returns {Promise<string>} - The transcribed text.
 */
const transcribeAudio = async (audioBuffer) => {
  try {
    if (!process.env.ASSEMBLYAI_API_KEY) {
      throw new Error('❌ ASSEMBLYAI_API_KEY is not set in environment variables');
    }

    console.log('🔁 Uploading audio to AssemblyAI...');

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
    console.log('✅ Upload successful. Upload URL:', uploadUrl);

    console.log('📤 Sending transcription request...');

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
    console.log('🧾 Transcript ID:', transcriptId);

    console.log('🔁 Polling for transcription result...');
    let transcript;

    while (true) {
      const polling = await axios.get(
        `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
        { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
      );

      if (polling.data.status === 'completed') {
        console.log('✅ Transcription completed.');
        transcript = polling.data.text;
        break;
      } else if (polling.data.status === 'error') {
        throw new Error(`❌ Transcription failed: ${polling.data.error}`);
      }

      console.log('⏳ Still processing...');
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }

    return transcript;

  } catch (err) {
    console.error('❌ Error in transcribeAudio:', err.response?.data || err.message || err);
    throw err; // Forward to the route
  }
};

module.exports = { transcribeAudio };
