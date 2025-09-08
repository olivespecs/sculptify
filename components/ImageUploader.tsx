import React, { useRef, useCallback } from 'react';
import { Spinner } from './Spinner';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onClear: () => void;
  displayUrl: string | null;
  onGenerateRandom: () => void;
  isGeneratingRandom: boolean;
  isDisabled: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onClear, displayUrl, onGenerateRandom, isGeneratingRandom, isDisabled }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
    // Reset file input value to allow re-uploading the same file
    if (event.target) {
        event.target.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!displayUrl && event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageUpload(event.dataTransfer.files[0]);
    }
  }, [onImageUpload, displayUrl]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <div>
      <input
        type="file"
        id="image-upload"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors overflow-hidden aspect-square flex items-center justify-center relative"
        onClick={!displayUrl && !isGeneratingRandom ? handleClick : undefined}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {displayUrl ? (
          <>
            <img src={displayUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
             <button
                onClick={onClear}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-1.5 hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                aria-label="Clear image and start over"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
          </>
        ) : isGeneratingRandom ? (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 space-y-4">
              <Spinner />
              <p className="text-lg font-semibold text-gray-700 animate-pulse">Generating a masterpiece...</p>
            </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
            <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <span className="material-symbols-outlined text-4xl text-gray-500">
                  cloud_upload
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-700">Upload your image</p>
              <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
            </label>
            <div className="flex items-center w-full max-w-xs my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-xs font-semibold">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>
            <button
                onClick={(e) => { 
                  e.stopPropagation();
                  onGenerateRandom(); 
                }}
                disabled={isDisabled}
                className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-md text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:bg-opacity-50 disabled:cursor-not-allowed"
            >
                <span className="material-symbols-outlined" style={{fontSize: '1.2rem'}}>auto_awesome</span>
                Use a Random Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};