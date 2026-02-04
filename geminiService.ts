
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /**
   * Shrinks base64 images to prevent browser crashes and API limit errors
   */
  private async compressImage(base64Str: string, maxWidth = 1024): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  }

  async transformHair(
    imageBase64: string, 
    color: string, 
    style: string, 
    includeColor: boolean, 
    includeStyle: boolean
  ): Promise<string> {
    try {
      // Fixed: Initialize GoogleGenAI strictly using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const compressedImage = await this.compressImage(imageBase64);
      
      let modeDescription = "";
      if (includeColor && includeStyle) {
        modeDescription = `Apply a high-ticket "${style}" haircut finished with a premium "${color}" color.`;
      } else if (includeColor) {
        modeDescription = `Keep the original haircut but transform the hair color to a high-luxury "${color}".`;
      } else if (includeStyle) {
        modeDescription = `Keep the original hair color but transform the hairstyle into a precise "${style}".`;
      } else {
        return imageBase64; 
      }

      const prompt = `Act as a world-class celebrity hair colorist specializing in Bronx Luxury. 
      ${modeDescription}
      Maintain professional studio lighting. Only modify hair. High-end fashion editorial quality. 
      Ensure the blend is seamless. Results must look realistic and expensive.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: compressedImage.split(',')[1],
                mimeType: 'image/jpeg',
              },
            },
            { text: prompt },
          ],
        },
      });

      const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (!part?.inlineData) throw new Error("AI Engine produced no visual output.");
      
      return `data:image/jpeg;base64,${part.inlineData.data}`;

    } catch (error) {
      console.error("Gemini Visualizer Failure:", error);
      throw error;
    }
  }

  async getVibeAnalysis(color: string, style: string, includeColor: boolean, includeStyle: boolean): Promise<string> {
    try {
      // Fixed: Initialize GoogleGenAI strictly using process.env.API_KEY
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const combo = (includeColor && includeStyle) ? `a ${style} with ${color}` : (includeColor ? color : style);
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are an elite salon business consultant. 
        Analyze why "${combo}" is a high-ticket look in the luxury Bronx market. 
        Keep it confident, exclusive, and under 30 words.`
      });
      return response.text || 'High-ticket transformation verified.';
    } catch (e) {
      return 'Signature luxury aesthetic confirmed.';
    }
  }
}

export const geminiService = new GeminiService();
