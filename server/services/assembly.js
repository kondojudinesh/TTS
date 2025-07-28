const fs = require('fs');
const axios = require('axios');

const transcribeAudio = async (filePath) => {
  const audio = fs.readFileSync(filePath);
  const response = await axios.post(
    'https://api.assemblyai.com/v2/upload',
    audio,
    {
      headers: {
        'authorization': process.env.ASSEMBLYAI_API_KEY,
        'content-type': 'application/octet-stream'
      }
    }
  );

  const uploadUrl = response.data.upload_url;

  const transcriptRes = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    { audio_url: uploadUrl },
    { headers: { authorization: process.env.ASSEMBLYAI_API_KEY } }
  );

  const transcriptId = transcriptRes.data.id;

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
      throw new Error('Transcription error');
    }
    await new Promise(r => setTimeout(r, 3000));
  }

  return transcript;
};

module.exports = { transcribeAudio };