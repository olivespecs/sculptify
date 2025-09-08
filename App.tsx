import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { EditPanel } from './components/EditPanel';
import { generateSculptureImage, refineSculptureImage } from './services/geminiService';
import { SCULPTURE_PROMPT, EDIT_PROMPT_PREFIX } from './constants';
import type { UploadedImage } from './types';

const App: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const mainContentRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const [header, data] = base64String.split(',');
      const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
      
      setUploadedImage({
        base64: data,
        mimeType: mimeType,
        displayUrl: base64String,
      });
      setGeneratedImage(null);
      setError(null);
    };
    reader.onerror = () => {
      setError("Failed to read the image file. Please try again.");
    };
    reader.readAsDataURL(file);
  }, []);
  
  const handleGenerate = useCallback(async (imageToUse: UploadedImage) => {
    if (!imageToUse) {
      setError("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setIsEditing(false);
    setError(null);
    setGeneratedImage(null);

    try {
      const result = await generateSculptureImage(imageToUse.base64, imageToUse.mimeType, SCULPTURE_PROMPT);
      if (result) {
        setGeneratedImage(`data:image/png;base64,${result}`);
      } else {
        setError("The AI model did not return an image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message.replace('Failed to generate image: ', ''));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRandomImage = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setUploadedImage(null);

    try {
      const response = await fetch('https://source.unsplash.com/512x512/?portrait,face');
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const [header, data] = base64String.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/jpeg';
        
        const randomImage: UploadedImage = {
          base64: data,
          mimeType: mimeType,
          displayUrl: base64String,
        };
        setUploadedImage(randomImage);
        handleGenerate(randomImage); 
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch a random image. Please try again or upload your own.");
      setIsLoading(false);
    }
  }, [handleGenerate]);

  const handleRefine = useCallback(async (refinePrompt: string) => {
    if (!generatedImage) {
      setError("No generated image to refine.");
      return;
    }

    setIsEditing(true);
    setError(null);

    const [header, data] = generatedImage.split(',');
    const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
    const fullPrompt = `${EDIT_PROMPT_PREFIX}${refinePrompt}`;

    try {
      const result = await refineSculptureImage(data, mimeType, fullPrompt);
      if (result) {
        setGeneratedImage(`data:image/png;base64,${result}`);
      } else {
        setError("The AI model did not return a refined image.");
      }
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "An unknown error occurred.";
      setError(message.replace('Failed to refine image: ', ''));
    } finally {
      setIsEditing(false);
    }
  }, [generatedImage]);

  const handleScrollToUpload = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onGetStartedClick={handleScrollToUpload} />
      <main ref={mainContentRef} className="flex-grow container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">Transform Your Images into Marble Masterpieces</h1>
            <p className="mt-4 text-lg text-gray-600">Our AI-powered tool converts your photos into breathtaking, photorealistic marble sculptures with stunning detail and elegance.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
              <ImageUploader onImageUpload={handleImageUpload} displayUrl={uploadedImage?.displayUrl ?? null} />
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => handleGenerate(uploadedImage!)}
                  disabled={!uploadedImage || isLoading || isEditing}
                  className="w-full bg-[var(--primary-color)] text-white font-bold py-3 px-4 rounded-lg text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading && !isEditing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Converting...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">auto_awesome</span>
                      <span>Convert to Sculpture</span>
                    </>
                  )}
                </button>
                 <button
                  onClick={handleRandomImage}
                  disabled={isLoading || isEditing}
                  className="w-full sm:w-auto bg-gray-800 text-white font-bold py-3 px-6 rounded-lg text-lg hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 disabled:bg-opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">casino</span>
                  <span>Random</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <ResultDisplay isLoading={isLoading} isEditing={isEditing} generatedImage={generatedImage} error={error} />
              {generatedImage && !isLoading && !isEditing && !error && (
                <EditPanel onRefine={handleRefine} isEditing={isEditing} />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
