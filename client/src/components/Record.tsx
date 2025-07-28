import React, { useState, useRef } from 'react';
import { Mic, Square, Play, Pause } from 'lucide-react';

interface RecordProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  disabled?: boolean;
}

const Record: React.FC<RecordProps> = ({ onRecordingComplete, disabled }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      chunks.current = [];
      
      mediaRecorder.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(chunks.current, { type: 'audio/webm' });
        onRecordingComplete(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      startTimer();
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current && isRecording) {
      if (isPaused) {
        mediaRecorder.current.resume();
        startTimer();
        setIsPaused(false);
      } else {
        mediaRecorder.current.pause();
        stopTimer();
        setIsPaused(true);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      stopTimer();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className={`p-4 rounded-full ${isRecording ? 'bg-red-100 dark:bg-red-900' : 'bg-blue-100 dark:bg-blue-900'} transition-colors duration-200`}>
            <Mic className={`w-8 h-8 ${isRecording ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}`} />
          </div>
        </div>
        
        {isRecording && (
          <div className="text-2xl font-mono text-gray-700 dark:text-gray-300">
            {formatTime(recordingTime)}
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          {!isRecording ? (
            <button
              onClick={startRecording}
              disabled={disabled}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
            >
              <Mic className="w-5 h-5 hover:animate-pulse" />
              <span>Start Recording</span>
            </button>
          ) : (
            <>
              <button
                onClick={pauseRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              
              <button
                onClick={stopRecording}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                <Square className="w-5 h-5" />
                <span>Stop</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Record;