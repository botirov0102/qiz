
import { GoogleGenAI } from "@google/genai";
import { ImageData, MatchStyle } from "../types";

export const generatePartnerImage = async (
  sourceImage: ImageData,
  style: MatchStyle
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  // List of variations to ensure diversity in every call
  const ethnicities = ["diverse", "Mediterranean", "Scandinavian", "Asian", "Latin American", "African", "Middle Eastern", "East European"];
  const hairStyles = ["long wavy", "short bob", "elegant updo", "curly", "straight", "braided"];
  const randomEthnicity = ethnicities[Math.floor(Math.random() * ethnicities.length)];
  const randomHair = hairStyles[Math.floor(Math.random() * hairStyles.length)];

  const prompt = `This is a photo of a person. Please edit this image to add a unique, beautiful, and perfectly matched female companion standing naturally next to them. 

  CRITICAL: Every time this prompt is run, generate a COMPLETELY UNIQUE person with distinct facial features, ethnicity, and style to ensure variety. 
  
  Partner Details for this specific generation:
  - Appearance: A unique woman with ${randomEthnicity} features and ${randomHair} hair.
  - Style: ${style}. 
  
  Instructions:
  1. Maintain the original person's identity, clothes, and position exactly.
  2. Add the female partner who looks like a real, distinct individual (not a generic model). 
  3. She should be interacting naturally (e.g., standing close, arm in arm, or looking towards the camera together).
  4. Match the lighting, shadows, grain, and photographic style of the original photo perfectly.
  5. The final image must look like a real, unedited photo taken at the same moment.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: sourceImage.base64.split(',')[1],
              mimeType: sourceImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data returned from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
