import axios from 'axios';

// Replace with your actual backend URL
const BASE_URL = 'https://tts-d3ed.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000, // 30 seconds timeout for file uploads
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

export const getTranscriptionHistory = async (): Promise<TranscriptionResult[]> => {
  try {
    const response = await api.get('/api/history');
    return response.data;
  } catch (error) {
    console.error('History fetch error:', error);
    throw new Error('Failed to fetch transcription history');
  }
};

// Mock functions for demonstration (remove when connecting to real backend)
export const mockUploadAudio = async (file: File): Promise<TranscriptionResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  return {
    id: Date.now().toString(),
    filename: file.name,
    transcription: `This is a mock transcription for the uploaded file "${file.name}". In a real implementation, this would contain the actual transcribed text from your speech-to-text service.`,
    created_at: new Date().toISOString(),
  };
};

export const mockGetHistory = async (): Promise<TranscriptionResult[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return [
    {
      id: '1',
      filename: 'meeting-recording.mp3',
      transcription: 'This is a sample transcription from a previous meeting recording. The meeting discussed quarterly goals and project timelines.',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      filename: 'voice-memo.wav',
      transcription: 'A quick voice memo about remembering to follow up with the client regarding the project proposal and timeline adjustments.',
      created_at: '2024-01-14T16:45:00Z',
    },
    {
      id: '3',
      filename: 'interview-session.m4a',
      transcription: 'Interview transcription with candidate discussing their experience in software development and project management skills.',
      created_at: '2024-01-13T14:20:00Z',
    },
  ];
};
