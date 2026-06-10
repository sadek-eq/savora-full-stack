import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { ingredients } = await req.json();

  try {
    const prompt = `I have these ingredients: ${ingredients.join(", ")}. Suggest 5 recipes I can make with primarily these ingredients. For each, return: {title, description, missingIngredients: [], difficulty, cookTimeMinutes}. Return as JSON array.`;

    const { cleanGeminiResponse } = await import("@/lib/gemini");
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return NextResponse.json(cleanGeminiResponse(response.text()));
  } catch (error) {
    return NextResponse.json({ error: "Failed to get pantry suggestions" }, { status: 500 });
  }
}
