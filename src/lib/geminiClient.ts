import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Please set GEMINI_API_KEY in your .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// System instruction focused on direct web scraping assistance
const SYSTEM_PROMPT = 
  "You are WebScraper AI, an intelligent assistant specialized in web scraping and data extraction. Your role is to help users extract, analyze, and understand data from websites efficiently. " +
  "Key Guidelines: Keep responses SHORT and CONCISE - aim for brevity while maintaining usefulness. Be direct and action-oriented - provide results, code snippets, or data rather than lengthy explanations. " +
  "Focus on delivering what the user needs with minimal text. When asked about scraping specific sites or data, provide practical solutions immediately. " +
  "Always format your responses in clean, professional Markdown with proper headings, code blocks, bullet points, and bold text for emphasis. " +
  "Avoid verbose explanations - get straight to the point. Provide actionable insights and ready-to-use solutions in the most compact form possible.";

export async function askGemini(prompt: string): Promise<string> {
  try {
    // Create a model with scraping-focused configuration
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 512,
      },
    });

    // Start chat and send message
    const chat = model.startChat();
    const result = await chat.sendMessage(prompt);
    
    return result.response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to get response from Gemini AI');
  }
}

// Example usage function for testing
export async function testScrapingQuery(): Promise<void> {
  try {
    const response = await askGemini(
      "In 4 bullets, explain the best practices for web scraping without getting blocked."
    );
    console.log('Gemini Response:', response);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// For direct Node.js execution
if (typeof require !== 'undefined' && require.main === module) {
  testScrapingQuery();
}