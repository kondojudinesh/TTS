import React, { useState, useEffect } from 'react';
import { Download, Clock, FileAudio } from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTranscriptionHistory, TranscriptionResult } from '../api/api';

const History: React.FC = () => {
  const [history, setHistory] = useState<TranscriptionResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await getTranscriptionHistory(); // uses fallback if needed
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
      alert('Failed to load transcription history');
    } finally {
      setLoading(false);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
        <LoadingSpinner size="lg" text="Loading transcription history..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Transcription History
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              View and download your past transcriptions
            </p>
          </div>

          {history.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700">
              <FileAudio className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No Transcriptions Yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Upload or record an audio file to see your transcriptions here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <FileAudio className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {item.filename}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => downloadTranscription(item.transcription, item.filename)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                    >
                      <Download className="w-4 h-4 hover:animate-bounce" />
                      <span>Download</span>
                    </button>
                  </div>

                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap line-clamp-4">
                      {item.transcription}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
