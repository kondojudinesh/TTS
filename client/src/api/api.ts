import axios from 'axios';

const BASE_URL = 'https://tts-d3ed.onrender.com'; // Your backend URL

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds
});

export interface TranscriptionResult {
  id: string;
  filename: string;
  transcription: string;
  created_at: string;
}

// ✅ REAL FUNCTION: Upload Audio File
export const uploadAudio = async (file: File): Promise<TranscriptionResult> => {
  const formData = new FormData();
  formData.append('audio', file);

  try {
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload and transcribe audio');
  }
};

// ✅ REAL FUNCTION: Get Transcription History
export const getTranscriptionHistory = async (): Promise<TranscriptionResult[]> => {
