import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Utility function to convert file to base64
async function fileToGenerativePart(file: File) {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix (e.g., "data:image/jpeg;base64,"),
        // which needs to be removed.
        resolve(reader.result.split(',')[1]);
      } else {
        // Handle ArrayBuffer or other cases if necessary, though for images it's typically a data URL
        resolve(''); // Or handle error appropriately
      }
    };
    reader.readAsDataURL(file);
  });

  const base64EncodedData = await base64EncodedDataPromise;

  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
}


export async function processImage(
  imageFile: File,
  prompt: string,
): Promise<string | null> {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          imagePart,
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    // Find the first image part in the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        return part.inlineData.data;
      }
    }

    // Handle cases where the model might respond with only text (e.g., safety rejection)
    const textResponse = response.text;
    if (textResponse) {
       // A text-only response might indicate a safety block or refusal.
       // We can throw an error with the model's text.
       if (textResponse.toLowerCase().includes('cannot') || textResponse.toLowerCase().includes('unable')) {
         throw new Error(`The AI model responded: "${textResponse}". This might be due to a safety policy.`);
       }
    }
    
    throw new Error("The AI model did not return an image. It might be an unsupported image format or a safety block.");

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    let message = "An unknown error occurred while communicating with the AI model.";
    if (error instanceof Error) {
        // Customize error messages based on potential issues
        if (error.message.includes('SAFETY')) {
            message = "The request was blocked due to safety concerns. Please use a different image.";
        } else if (error.message.includes('400')) {
             message = "There was a problem with the request (e.g. invalid image format). Please try a different image.";
        } else {
            message = error.message;
        }
    }
    throw new Error(message);
  }
}

export async function generateImageFromPrompt(prompt: string): Promise<string | null> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '1:1',
            },
        });
        
        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        }

        throw new Error("The AI model did not return an image.");

    } catch (error) {
        console.error("Error calling Gemini API for image generation:", error);
        let message = "An unknown error occurred while generating the image.";
        if (error instanceof Error) {
            message = error.message;
        }
        throw new Error(message);
    }
}
