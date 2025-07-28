import axios from 'axios';

// Replace with your actual backend URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

export interface TranscriptionResult {
  id: string;
  filename: string;
  transcription: string;
  created_at: string;
}

// ✅ Mock functions (for fallback)
const mockUploadAudio = async (file: File): Promise<TranscriptionResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: Date.now().toString(),
    filename: file.name,
    transcription: `🔁 Mock transcription for file "${file.name}" (used fallback).`,
    created_at: new Date().toISOString(),
  };
};

const mockGetHistory = async (): Promise<TranscriptionResult[]> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      id: '1',
      filename: 'meeting-recording.mp3',
      transcription: '📝 Mock: Meeting transcription sample.',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      filename: 'voice-memo.wav',
      transcription: '📝 Mock: Voice memo about client follow-up.',
      created_at: '2024-01-14T16:45:00Z',
    }
  ];
};

// ✅ Actual API function with fallback to mock
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
  created_at: new Date().toISOString()
};

  } catch (error) {
    console.warn('❌ Upload failed, using mock response.', error);
    return await mockUploadAudio(file); // Fallback to mock
  }
};

export const getTranscriptionHistory = async (): Promise<TranscriptionResult[]> => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error) {
    console.warn('❌ History fetch failed, using mock response.', error);
    return await mockGetHistory(); // Fallback to mock
  }
};
