import axios from 'axios';

// Use your deployed backend. You can later switch to:
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const BASE_URL = 'https://tts-d3ed.onrender.com';

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

type UploadResponse = {
  id?: string;
  filename?: string;
  transcript?: string;
  created_at?: string;
  // for error responses:
  error?: string;
  detail?: any;
};

export const uploadAudio = async (file: File): Promise<TranscriptionResult> => {
  const formData = new FormData();
  // IMPORTANT: field name must be "audio" to match your multer config
  formData.append('audio', file);

  try {
    const { data } = await api.post<UploadResponse>('/api/audio/transcribe', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    // Normalize the response for the UI
    return {
      id: data.id ?? Date.now().toString(), // fallback if backend didn't send id
      filename: data.filename ?? file.name,
      transcription: data.transcript ?? '',
      created_at: data.created_at ?? new Date().toISOString(),
    };
  } catch (err: any) {
    // Better console diagnostics
    if (axios.isAxiosError(err)) {
      console.error('❌ Upload failed:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    } else {
      console.error('❌ Upload failed (non-Axios error):', err);
    }
    throw err; // let the UI show "Failed to transcribe"
  }
};

export const getTranscriptionHistory = async (): Promise<TranscriptionResult[]> => {
  try {
    const { data } = await api.get<any[]>('/api/history');

    // Your Supabase table likely returns: { id, filename, text, created_at }
    // Map it to what the UI expects.
    return (data ?? []).map((row) => ({
      id: String(row.id ?? ''),
      filename: row.filename ?? 'Unknown',
      transcription: row.text ?? '',        // <-- map text -> transcription
      created_at: row.created_at ?? new Date().toISOString(),
    }));
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      console.error('❌ History fetch failed:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    } else {
      console.error('❌ History fetch failed (non-Axios error):', err);
    }
    throw err; // let the UI show "Failed to load transcription history"
  }
};
