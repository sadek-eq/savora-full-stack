import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  generationConfig: {
    responseMimeType: "application/json",
  }
});

export function cleanGeminiResponse(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/```json\s?([\s\S]*?)\s?```/) || text.match(/{[\s\S]*}/);
    if (match) {
      try {
        return JSON.parse(match[1] || match[0]);
      } catch (innerError) {
        throw new Error("Failed to parse Gemini JSON");
      }
    }
    throw new Error("No JSON found");
  }
}

export async function generateRecipeFromName(name: string) {
  const prompt = `Generate a complete recipe for '${name}'. Return as structured JSON: {
    "title": "...",
    "description": "...",
    "ingredients": [{"name": "...", "quantity": "...", "unit": "..."}],
    "steps": [{"stepNumber": 1, "instruction": "...", "timerSeconds": 0, "imageDescription": "..."}],
    "prepTimeMinutes": 0,
    "cookTimeMinutes": 0,
    "servings": 0,
    "difficulty": "easy/medium/hard",
    "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0},
    "dietaryTags": []
  }.`;

  const result = await geminiModel.generateContent(prompt);
  const response = await result.response;
  return cleanGeminiResponse(response.text());
}
