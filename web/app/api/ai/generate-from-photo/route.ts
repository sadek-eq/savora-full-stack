import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { getUnsplashPhoto } from "@/lib/unsplash";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { image } = await req.json(); // base64

  try {
    const prompt = `Identify this dish and generate a complete recipe for it. Return as structured JSON: {title, description, ingredients: [{name, quantity, unit}], steps: [{stepNumber, instruction, timerSeconds, imageDescription}], prepTimeMinutes, cookTimeMinutes, servings, difficulty, nutrition: {calories, protein, carbs, fat}, dietaryTags: []}.`;

    const { cleanGeminiResponse } = await import("@/lib/gemini");
    const result = await geminiModel.generateContent([
      prompt,
      {
        inlineData: {
          data: image,
          mimeType: "image/jpeg",
        },
      },
    ]);
    const response = await result.response;
    const recipe = cleanGeminiResponse(response.text());

    recipe.mainImageUrl = await getUnsplashPhoto(recipe.title);
    for (const step of recipe.steps) {
      step.imageUrl = await getUnsplashPhoto(step.imageDescription);
    }

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate recipe from photo" }, { status: 500 });
  }
}
