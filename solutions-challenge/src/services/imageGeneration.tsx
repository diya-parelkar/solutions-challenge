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

class ImageGenerationService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private imageCache: Map<string, string>; // Cache for storing images

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

    this.imageCache = new Map(); // Initialize cache
  }

  async generateImage(prompt: string): Promise<string | null> {
    // Check if the image is already in cache
    if (this.imageCache.has(prompt)) {
      console.log(`Cache hit for prompt: "${prompt}"`);
      return this.imageCache.get(prompt) || null;
    }

    try {
      const modifiedPrompt = `${prompt}. Please return the image as a Base64-encoded PNG without an image URL.`;
      console.log("Sending prompt to Gemini API:", modifiedPrompt);

      const response = await this.model.generateContent(modifiedPrompt);
      console.log("Raw API response:", JSON.stringify(response, null, 2));

      const parts = response.response?.candidates?.[0]?.content?.parts;
      if (!parts?.length) {
        throw new Error("No valid response from Gemini API");
      }

      const imagePart = parts.find((part: ContentPart) => part.inlineData?.data);

      if (imagePart?.inlineData?.data) {
        const base64Image = `data:image/png;base64,${imagePart.inlineData.data}`;
        console.log("Extracted Base64 image (truncated):", base64Image.substring(0, 50) + "...");

        // Store in cache
        this.imageCache.set(prompt, base64Image);

        return base64Image;
      }

      throw new Error("No Base64 image data found in response");
    } catch (error) {
      console.error("Error generating image:", error);
      return null;
    }
  }

  async processContent(content: string): Promise<string> {
    const imagePlaceholderRegex = /\[\[image:(.*?)\]\]/g;
    let modifiedContent = content;
    const matches = [...content.matchAll(imagePlaceholderRegex)];

    console.log(`Found ${matches.length} image placeholders`);

    for (const match of matches) {
      const prompt = match[1].trim();
      console.log("Generating image for prompt:", prompt);

      const base64Image = await this.generateImage(prompt);

      modifiedContent = modifiedContent.replace(
        match[0],
        base64Image
          ? `<div style="text-align: center; margin: 10px 0;">
              <img src="${base64Image}" alt="${prompt}" 
                style="width: 300px; height: 200px; object-fit: cover; border-radius: 8px; cursor: pointer;"
                title="Prompt: ${prompt}"
              />
              <p style="font-size: 12px; color: grey; margin-top: 5px;">AI Generated</p>
            </div>`
          : `<p style="color: red;">Failed to load image: ${prompt}</p>`
      );
    }

    console.log("Processed content:", modifiedContent);
    return modifiedContent;
  }
}

export default ImageGenerationService;
