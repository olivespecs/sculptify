import React, { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  displayUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, displayUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageUpload(event.target.files[0]);
    }
  };

  const handleClick = () => {
    // Only trigger file input if no image is displayed
    if (!displayUrl) {
      fileInputRef.current?.click();
    }
  };

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      onImageUpload(event.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

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
      <label htmlFor="image-upload" className={displayUrl ? '' : 'cursor-pointer'}>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg text-center hover:border-gray-400 transition-colors overflow-hidden aspect-square flex items-center justify-center"
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {displayUrl ? (
            <img src={displayUrl} alt="Uploaded preview" className="w-full h-full object-cover" />
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
              <div className="bg-gray-100 p-4 rounded-full">
                <span className="material-symbols-outlined text-4xl text-gray-500">
                  cloud_upload
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-700">Upload your image</p>
              <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};
