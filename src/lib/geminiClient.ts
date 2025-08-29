import { GoogleGenerativeAI } from "@google/generative-ai";

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!API_KEY) {
  throw new Error("Please set GEMINI_API_KEY in your .env file");
}

const genAI = new GoogleGenerativeAI(API_KEY);

// System instruction focused on direct web scraping assistance
const SYSTEM_PROMPT = 
  "You are a direct web scraping assistant. Your job is to help users find and extract the specific data they need from websites - no tutorials, no step-by-step guides, just results. " +
  "Your approach: Directly provide the data or information requested, give ready-to-use code snippets when needed, focus on solving the immediate problem, be concise and action-oriented, skip explanations unless specifically asked. " +
  "IMPORTANT: Format ALL responses in clean Markdown format with: " +
  "proper headings (##, ###), code blocks with language specification, " +
  "bullet points for lists, bold text for emphasis, and well-structured, " +
  "readable formatting. Be direct, helpful, and get straight to the point. Users want solutions, not lessons.";

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