import { describe, it, expect, vi, beforeEach } from "vitest";
import { GeminiService } from "../services/gemini";

// Mock Google Generative AI
const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn(() => ({
  generateContent: mockGenerateContent,
}));

vi.mock("@google/generative-ai", () => ({
  GoogleGenerativeAI: vi.fn(() => ({
    getGenerativeModel: mockGetGenerativeModel,
  })),
}));

describe("GeminiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with API key", () => {
    const service = new GeminiService("test-key");
    expect(service).toBeDefined();
  });

  it("should throw error without API key", () => {
    expect(() => new GeminiService("")).toThrow("API Key is required");
  });

  it("should extract content successfully", async () => {
    const mockResponse = {
      response: {
        text: () =>
          JSON.stringify({
            title: "Test Title",
            content: "<p>Test Content</p>",
          }),
      },
    };
    mockGenerateContent.mockResolvedValue(mockResponse);

    const service = new GeminiService("test-key");
    const result = await service.extractContent("<html>...</html>", "https://example.com");

    expect(result.title).toBe("Test Title");
    expect(result.content).toBe("<p>Test Content</p>");
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: "gemini-pro" });
  });

  it("should handle markdown code blocks in response", async () => {
    const mockResponse = {
      response: {
        text: () => '```json\n{"title": "Clean", "content": "Clean Content"}\n```',
      },
    };
    mockGenerateContent.mockResolvedValue(mockResponse);

    const service = new GeminiService("test-key");
    const result = await service.extractContent("<html>...</html>", "https://example.com");

    expect(result.title).toBe("Clean");
  });

  it("should throw error on API failure", async () => {
    mockGenerateContent.mockRejectedValue(new Error("API Error"));
    const service = new GeminiService("test-key");

    await expect(service.extractContent("html", "url")).rejects.toThrow(
      "Failed to extract content with Gemini",
    );
  });
});
