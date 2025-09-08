import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { EditPanel } from './components/EditPanel';
import { ResultDisplay } from './components/ResultDisplay';
import { processImage, generateImageFromPrompt } from './services/geminiService';
import { SCULPTURE_PROMPT, REFINE_PROMPT_TEMPLATE, loadingMessages, RANDOM_ITEM_PROMPTS, RANDOM_IMAGE_PROMPT_TEMPLATE } from './constants';
import { UploadedImage } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<UploadedImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isGeneratingRandom, setIsGeneratingRandom] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>(loadingMessages[0]);
  
  const loadingIntervalRef = useRef<number | null>(null);
  
  // Effect to clean up the interval timer when the component unmounts.
  useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
      }
    };
  }, []);

  const stopLoadingSequence = useCallback(() => {
    setIsLoading(false);
    setIsEditing(false);
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
      loadingIntervalRef.current = null;
    }
  }, []);

  const startLoadingSequence = useCallback((editing: boolean = false) => {
    setIsLoading(true);
    setIsEditing(editing);
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }
    let index = 0;
    setLoadingMessage(loadingMessages[index]);
    loadingIntervalRef.current = window.setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 2500);
  }, []);
  
  const handleClear = useCallback(() => {
    setOriginalImage(null);
    setEditedImage(null);
    setError(null);
    stopLoadingSequence();
  }, [stopLoadingSequence]);

  const handleImageUpload = useCallback(async (file: File) => {
    const dataUrl = URL.createObjectURL(file);
    const newImage = { file, dataUrl };
    
    setOriginalImage(newImage);
    setEditedImage(null); // Clear previous edits
    setError(null);
    startLoadingSequence();

    try {
      const result = await processImage(newImage.file, SCULPTURE_PROMPT);
      if (result) {
        setEditedImage(`data:image/jpeg;base64,${result}`);
      } else {
        setError("The AI model did not return an image. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      // Clear the image if the initial conversion fails
      setOriginalImage(null);
    } finally {
      stopLoadingSequence();
    }
  }, [startLoadingSequence, stopLoadingSequence]);

  const handleRefine = useCallback(async (refinePrompt: string) => {
    if (!originalImage) {
      setError("Please upload an image first.");
      return;
    }

    setError(null);
    startLoadingSequence(true);

    try {
      const prompt = REFINE_PROMPT_TEMPLATE(refinePrompt);
      const result = await processImage(originalImage.file, prompt);
      if (result) {
        setEditedImage(`data:image/jpeg;base64,${result}`);
      } else {
        setError("The AI model did not return an image for refinement. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred during refinement.");
    } finally {
      stopLoadingSequence();
    }
  }, [originalImage, startLoadingSequence, stopLoadingSequence]);
  
  const base64ToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handleRandomImage = useCallback(async () => {
    handleClear();
    setIsGeneratingRandom(true);
    setError(null);
    try {
      const item = RANDOM_ITEM_PROMPTS[Math.floor(Math.random() * RANDOM_ITEM_PROMPTS.length)];
      const prompt = RANDOM_IMAGE_PROMPT_TEMPLATE(item);
      const generatedImageBase64 = await generateImageFromPrompt(prompt);
      if (!generatedImageBase64) {
        throw new Error("Failed to generate a random image.");
      }

      setIsGeneratingRandom(false);
      
      const mimeType = 'image/jpeg';
      const imageDataUrl = `data:${mimeType};base64,${generatedImageBase64}`;
      const imageFile = await base64ToFile(imageDataUrl, 'random-portrait.jpg');
      
      await handleImageUpload(imageFile);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to generate a random portrait.");
      setIsGeneratingRandom(false);
    }
  }, [handleClear, handleImageUpload]);


  // Scroll to the main content area when the "Get Started" button is clicked.
  const mainContentRef = useRef<HTMLDivElement>(null);
  const handleGetStartedClick = () => {
    mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header onGetStartedClick={handleGetStartedClick} />
      <main ref={mainContentRef} className="flex-grow container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">Bring Your Photos to Life in Marble</h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Upload an image and watch as our AI transforms it into a timeless, classical-style marble sculpture.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6">
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              onClear={handleClear} 
              displayUrl={originalImage?.dataUrl ?? null} 
              onGenerateRandom={handleRandomImage}
              isGeneratingRandom={isGeneratingRandom}
              isDisabled={isLoading || isGeneratingRandom}
            />
            {originalImage && (
              <EditPanel onRefine={handleRefine} isEditing={isLoading} />
            )}
          </div>
          <div className="md:sticky md:top-28">
            <ResultDisplay
              isLoading={isLoading}
              isEditing={isEditing}
              loadingMessage={loadingMessage}
              originalImage={originalImage?.dataUrl ?? null}
              editedImage={editedImage}
              error={error}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;