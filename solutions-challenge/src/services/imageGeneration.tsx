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
  text?: string;
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
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
    });

    this.imageCache = new Map();
  }

  async generateImage(prompt: string): Promise<{ url: string; isGenerated: boolean } | null> {
    if (this.imageCache.has(prompt)) {
      const cached = this.imageCache.get(prompt);
      return cached ? { url: cached, isGenerated: cached.startsWith('data:image') } : null;
    }

    try {
      const result = await this.model.generateContent({
        contents: [{
          role: "user",
          parts: [{
            text: `Generate a detailed, educational image for: ${prompt}. The image should be clear, informative, and suitable for educational content.`
          }]
        }],
        generationConfig: {
          responseModalities: ["Text", "Image"]
        }
      });
      
      const response = await result.response;
      console.log('Gemini response:', response); // Debug log
      
      // Extract image data from response
      const imageData = response.candidates?.[0]?.content?.parts?.find(
        (part: ContentPart) => part.inlineData?.data
      )?.inlineData?.data;

      if (imageData) {
        const imageUrl = `data:image/png;base64,${imageData}`;
        this.imageCache.set(prompt, imageUrl);
        return { url: imageUrl, isGenerated: true };
      }
      
      // Fallback to Unsplash if no image data
      const fallbackImage = `https://source.unsplash.com/featured/?${encodeURIComponent(prompt)}`;
      this.imageCache.set(prompt, fallbackImage);
      return { url: fallbackImage, isGenerated: false };
    } catch (error) {
      console.error("Error generating image:", error);
      // Fallback to direct Unsplash search on error
      const fallbackImage = `https://source.unsplash.com/featured/?${encodeURIComponent(prompt)}`;
      this.imageCache.set(prompt, fallbackImage);
      return { url: fallbackImage, isGenerated: false };
    }
  }

  async processContent(content: string): Promise<string> {
    const imagePlaceholderRegex = /\[image:(.*?):(.*?)\]/g;
    let modifiedContent = content;
    const matches = [...content.matchAll(imagePlaceholderRegex)];
  
    for (const match of matches) {
      const simplePrompt = match[1].trim();
      const detailedPrompt = match[2].trim();
      
      console.log(`Processing image for: ${simplePrompt}`);
      
      let imageResult = await this.searchImage(simplePrompt);
      let isGenerated = false;
  
      if (!imageResult) {
        console.log(`No suitable image found for: ${simplePrompt}. Generating image...`);
        imageResult = await this.generateImage(detailedPrompt);
        isGenerated = imageResult?.isGenerated || false;
      }
      
      modifiedContent = modifiedContent.replace(
        match[0],
        imageResult
          ? `<div style="text-align: center; margin: 10px 0; position: relative;">
              <img src="${imageResult.url}" alt="${simplePrompt}" 
                style="width: 300px; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                title="Prompt: ${simplePrompt}"
                onerror="this.onerror=null; this.src='https://source.unsplash.com/featured/?${encodeURIComponent(simplePrompt)}';"
              />
              ${isGenerated ? `
                <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0, 0, 0, 0.7); color: white; padding: 4px 8px; font-size: 12px; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  AI Generated
                </div>
              ` : ''}
            </div>`
          : `<p style="color: red;">Failed to load image: ${simplePrompt}</p>`
      );
    }
    return modifiedContent;
  }

  async searchImage(query: string): Promise<{ url: string; isGenerated: boolean } | null> {
    try {
      const searchResponse = await fetch(
        `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&key=${import.meta.env.VITE_GOOGLE_SEARCH_API_KEY}&cx=${import.meta.env.VITE_GOOGLE_CSE_ID}`
      );      
      const data = await searchResponse.json();

      if (data.items) {
        const bestMatch = data.items.slice(0, 6).map((item: any) => item.link);
        return bestMatch.length > 0 ? { url: bestMatch[0], isGenerated: false } : null;
      }
    } catch (error) {
      console.error("Error searching for image:", error);
    }
    return null;
  }
}

export default ImageSelectionService;
