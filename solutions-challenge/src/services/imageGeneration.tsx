import { GoogleGenerativeAI } from "@google/generative-ai";

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: ContentPart[];
    };
  }[];
}

interface ContentPart {
  inlineData?: { data: string };
}

class ImageSelectionService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private imageCache: Map<string, string>;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_IMAGE_KEY;
    if (!apiKey) {
      throw new Error("Missing API key for Gemini AI");
    }

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"],
      } as any,
    });

    this.imageCache = new Map();
  }

  async generateImage(prompt: string): Promise<string | null> {
    if (this.imageCache.has(prompt)) {
      return this.imageCache.get(prompt) || null;
    }

    try {
      const response = await this.model.generateContent(
        `${prompt}. Please return a Base64-encoded PNG.`
      );
      
      const parts = response.response?.candidates?.[0]?.content?.parts;
      const imagePart = parts?.find((part: ContentPart) => part.inlineData?.data);

      if (imagePart?.inlineData?.data) {
        const base64Image = `data:image/png;base64,${imagePart.inlineData.data}`;
        this.imageCache.set(prompt, base64Image);
        return base64Image;
      }
    } catch (error) {
      console.error("Error generating image:", error);
    }
    return null;
  }

  async processContent(content: string): Promise<string> {
    const imagePlaceholderRegex = /\[image:(.*?):(.*?)\]/g;
    let modifiedContent = content;
    const matches = [...content.matchAll(imagePlaceholderRegex)];
  
    for (const match of matches) {
      const simplePrompt = match[1].trim();
      const detailedPrompt = match[2].trim();
      
      console.log(`Processing image for: ${simplePrompt}`);
      
      let base64Image = await this.searchImage(simplePrompt);
      let isGenerated = false;
  
      if (!base64Image) {
        console.log(`No suitable image found for: ${simplePrompt}. Generating image...`);
        base64Image = await this.generateImage(detailedPrompt);
        isGenerated = base64Image !== null; // Mark as generated if an image is returned
      }
      
      modifiedContent = modifiedContent.replace(
        match[0],
        base64Image
          ? `<div style="text-align: center; margin: 10px 0;">
              <img src="${base64Image}" alt="${simplePrompt}" 
                style="width: 300px; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                title="Prompt: ${simplePrompt}"
              />
              ${isGenerated ? '<p style="font-size: 12px; color: grey; margin-top: 5px;">AI Generated</p>' : ''}
            </div>`
          : `<p style="color: red;">Failed to load image: ${simplePrompt}</p>`
      );
    }
    return modifiedContent;
  }  

  async searchImage(query: string): Promise<string | null> {
    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&key=${import.meta.env.VITE_GOOGLE_SEARCH_API_KEY}&cx=${import.meta.env.VITE_GOOGLE_CSE_ID}`
      );      
      const data = await searchResponse.json();

      if (data.items) {
        const bestMatch = data.items.slice(0, 6).map((item: any) => item.link);
        return bestMatch.length > 0 ? bestMatch[0] : null;
      }
    } catch (error) {
      console.error("Error searching for image:", error);
    }
    return null;
  }
}

export default ImageSelectionService;
