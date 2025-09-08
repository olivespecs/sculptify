import React from 'react';
import { Spinner } from './Spinner';

interface ResultDisplayProps {
  isLoading: boolean;
  isEditing: boolean;
  loadingMessage: string;
  originalImage: string | null;
  editedImage: string | null;
  error: string | null;
}

const Placeholder: React.FC = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
        <p className="mt-4 text-base font-semibold text-gray-600">Your Sculpture Appears Here</p>
        <p className="text-sm text-gray-500 mt-1">Upload an image or generate a random one to begin.</p>
    </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, isEditing, loadingMessage, originalImage, editedImage, error }) => {

  const renderContent = () => {
    const imageToShow = editedImage || originalImage;

    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-gray-500 p-8 relative w-full h-full">
            {imageToShow && <img src={imageToShow} alt="Processing" className="w-full h-full object-cover opacity-30" />}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50">
                <Spinner />
                <p className="mt-4 text-lg animate-pulse">
                    {loadingMessage}
                </p>
            </div>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-500 p-4 flex flex-col items-center justify-center h-full">
          <span className="material-symbols-outlined text-5xl">error</span>
          <p className="font-bold mt-2">An Error Occurred</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }
    if (imageToShow) {
      return <img src={imageToShow} alt="Generated sculpture" className="w-full h-full object-cover" />;
    }
    return <Placeholder />;
  };

  const getSubText = () => {
    if (isLoading) return isEditing ? 'Refining your sculpture...' : 'Converting your image...';
    if (error) return "Please try again or upload a different image.";
    if (editedImage) return "Your sculpture has been created!";
    if (originalImage) return "Initial sculpture ready for refinement.";
    return null;
  }
  
  const subText = getSubText();

  return (
    <div className="flex flex-col">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden aspect-square flex items-center justify-center shadow-sm">
        {renderContent()}
      </div>
      <div className="h-8 flex items-center justify-center gap-2">
        {subText && (
          <p className="text-sm text-gray-500 mt-2 text-center">{subText}</p>
        )}
        {editedImage && !isLoading && !error && (
            <a
              href={editedImage}
              download="sculpture.jpg"
              className="mt-2 text-gray-500 hover:text-[var(--primary-color)] transition-colors"
              title="Download Sculpture"
              aria-label="Download Sculpture"
            >
              <span className="material-symbols-outlined">download</span>
            </a>
        )}
      </div>
    </div>
  );
};