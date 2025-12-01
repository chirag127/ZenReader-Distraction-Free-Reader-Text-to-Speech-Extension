import { GoogleGenerativeAI } from "@google/generative-ai";

export interface ExtractedContent {
  title: string;
  content: string; // HTML string
  byline?: string;
  excerpt?: string;
}

export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("API Key is required");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async extractContent(html: string, url: string): Promise<ExtractedContent> {
    const model = this.genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an expert content extractor. Your task is to extract the main article content from the provided HTML.

    URL: ${url}

    HTML Content (truncated if too large):
    ${html.substring(0, 30000)}

    Instructions:
    1. Extract the main article title.
    2. Extract the full article content as clean semantic HTML (use <p>, <h2>, <ul>, etc.).
    3. Remove ads, sidebars, navigation, and other clutter.
    4. Keep images if they are part of the article (<img src="...">).
    5. Return the result as a valid JSON object with keys: "title" and "content".

    Do not wrap the JSON in markdown code blocks. Just return the raw JSON string.
    `;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up potential markdown formatting in response
      const cleanText = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

      return JSON.parse(cleanText) as ExtractedContent;
    } catch (error) {
      console.error("Gemini Extraction Error:", error);
      throw new Error("Failed to extract content with Gemini");
    }
  }
}
