import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

async function callGemini(
  base64ImageData: string,
  mimeType: string,
  prompt: string,
): Promise<string | null> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image-preview',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64ImageData,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  if (response.candidates && response.candidates.length > 0) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
  }
  
  return null;
}

export async function generateSculptureImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string,
): Promise<string | null> {
   try {
    return await callGemini(base64ImageData, mimeType, prompt);
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI model.");
  }
}

export async function refineSculptureImage(
  base64ImageData: string,
  mimeType: string,
  prompt: string,
): Promise<string | null> {
  try {
    return await callGemini(base64ImageData, mimeType, prompt);
  } catch (error) {
    console.error("Error calling Gemini API for refinement:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to refine image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the AI model for refinement.");
  }
}
