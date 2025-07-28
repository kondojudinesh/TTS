import React, { useRef } from 'react';
import { Upload, FileAudio } from 'lucide-react';

interface UploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const UploadComponent: React.FC<UploadProps> = ({ onFileSelect, disabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,.wav,.m4a,.ogg"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />
      
      <button
        onClick={handleClick}
        disabled={disabled}
        className="w-full flex items-center justify-center space-x-3 p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group transform hover:scale-[1.02] active:scale-[0.98]"
      >
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors duration-200">
            <Upload className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:animate-bounce" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              Upload Audio File
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              MP3, WAV, M4A, OGG up to 100MB
            </p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default UploadComponent;