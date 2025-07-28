import React, { useState, useEffect } from 'react';
import { uploadAudio, TranscriptionResult } from '../api/api';

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);
  const [isMockUsed, setIsMockUsed] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (mediaRecorder) {
      mediaRecorder.ondataavailable = (event) => {
        setAudioChunks((prev) => [...prev, event.data]);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setAudioChunks([]);
      };
    }
  }, [mediaRecorder, audioChunks]);

  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);
    recorder.start();
  };

  const stopRecording = () => {
    setIsRecording(false);
    mediaRecorder?.stop();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile && !recordedBlob) return;

    setIsTranscribing(true);
    setIsMockUsed(false);
    try {
      let file: File;

      if (selectedFile) {
        file = selectedFile;
      } else if (recordedBlob) {
        file = new File([recordedBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
      } else {
        return;
      }

      const result = await uploadAudio(file);
      setTranscription(result);
      if (result.mock === true) setIsMockUsed(true);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  return (
    <div className="p-4 text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">Audio Transcription</h1>

      <div className="space-y-4">
        <div>
          <label className="block mb-1">Upload an audio file:</label>
          <input type="file" accept="audio/*" onChange={handleFileChange} />
        </div>

        <div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
            onClick={isRecording ? stopRecording : startRecording}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>

        <div>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={handleTranscribe}
            disabled={isTranscribing || (!selectedFile && !recordedBlob)}
          >
            {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
          </button>
        </div>
      </div>

      {transcription && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Transcription Result:</h2>
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
            {JSON.stringify(transcription, null, 2)}
          </pre>
          {isMockUsed && (
            <p className="mt-2 text-yellow-500 font-semibold">
              ⚠️ Using mock data because backend API was unavailable.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
