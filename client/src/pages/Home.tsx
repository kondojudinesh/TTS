import React, { useState } from 'react';
import { Download } from 'lucide-react';
import Upload from '../components/Upload';
import Record from '../components/Record';
import LoadingSpinner from '../components/LoadingSpinner';
import { uploadAudio, TranscriptionResult } from '../api/api'; // ✅ use uploadAudio instead of mock

const Home: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState<TranscriptionResult | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setRecordedBlob(null);
    setTranscription(null);
  };

  const handleRecordingComplete = (audioBlob: Blob) => {
    setRecordedBlob(audioBlob);
    setSelectedFile(null);
    setTranscription(null);
  };

  const handleTranscribe = async () => {
    if (!selectedFile && !recordedBlob) return;

    setIsTranscribing(true);
    try {
      let file: File;

      if (selectedFile) {
        file = selectedFile;
      } else if (recordedBlob) {
        file = new File([recordedBlob], `recording-${Date.now()}.webm`, { type: 'audio/webm' });
      } else {
        return;
      }

      // ✅ Use real API with fallback
      const result = await uploadAudio(file);
      setTranscription(result);
    } catch (error) {
      console.error('Transcription error:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const downloadTranscription = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename.replace(/\.[^/.]+$/, '')}-transcription.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const canTranscribe = (selectedFile || recordedBlob) && !isTranscribing;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">

          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Upload Audio File
            </h2>
            <Upload onFileSelect={handleFileSelect} disabled={isTranscribing} />
            {selectedFile && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Selected: {selectedFile.name}
                </p>
              </div>
            )}
          </div>

          {/* Recording Section */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Record Audio
            </h2>
            <Record onRecordingComplete={handleRecordingComplete} disabled={isTranscribing} />
            {recordedBlob && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
                <p className="text-green-800 dark:text-green-300 font-medium">
                  Recording completed! Ready to transcribe.
                </p>
              </div>
            )}
          </div>

          {/* Transcribe Button */}
          <div className="text-center">
            <button
              onClick={handleTranscribe}
              disabled={!canTranscribe}
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-lg shadow-lg disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:transform-none hover:shadow-2xl"
            >
              {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
            </button>
          </div>

          {/* Loading State */}
          {isTranscribing && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <LoadingSpinner size="lg" text="Transcribing your audio..." />
            </div>
          )}

          {/* Transcription Result */}
          {transcription && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Transcription Result
                </h3>
                <button
                  onClick={() => downloadTranscription(transcription.transcription, transcription.filename)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                >
                  <Download className="w-4 h-4 hover:animate-bounce" />
                  <span>Download</span>
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">File:</span> {transcription.filename}
                </p>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                    {transcription.transcription}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Home;
