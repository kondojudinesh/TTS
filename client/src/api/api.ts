import axios from 'axios';

const BASE_URL = 'https://tts-d3ed.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

export interface TranscriptionResult {
  id: string;
  filename: string;
  transcription: string;
  created_at: string;
}

export const uploadAudio = async (file: File): Promise<TranscriptionResult> => {
  const formData = new FormData();
  formData.append('audio', file);

  try {
    const response = await api.post('/api/audio/transcribe', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      id: Date.now().toString(),
      filename: response.data.filename,
      transcription: response.data.transcript,
      created_at: new Date().toISOString(),
    };
  } catch (error) {
    console.error('❌ Upload failed:', error);
    throw error;
  }
};

export const getTranscriptionHistory = async (): Promise<TranscriptionResult[]> => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error) {
    console.error('❌ History fetch failed:', error);
    throw error;
  }
};
