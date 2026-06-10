import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { generateRecipeFromName } from "@/lib/gemini";
import { getUnsplashPhoto } from "@/lib/unsplash";
import { db } from "@/lib/db";
import { aiUsage } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name) return NextResponse.json({ error: "Dish name is required" }, { status: 400 });

  try {
    // Check AI usage
    const monthYear = new Date().toISOString().slice(0, 7);
    const [usage] = await db.insert(aiUsage)
      .values({ userId, monthYear, generationCount: 1 })
      .onConflictDoUpdate({
        target: [aiUsage.userId, aiUsage.monthYear],
        set: { generationCount: sql`${aiUsage.generationCount} + 1` }
      })
      .returning();

    // Logic for Pro tier check would go here in production
    // if (user.subscriptionTier === 'free' && usage.generationCount > 5) {
    //   return NextResponse.json({ error: "Limit reached" }, { status: 403 });
    // }

    const recipe = await generateRecipeFromName(name);

    // Add images for steps and main image
    const mainImageUrl = await getUnsplashPhoto(recipe.title);
    recipe.mainImageUrl = mainImageUrl;

    for (const step of recipe.steps) {
      if (step.imageDescription) {
        step.imageUrl = await getUnsplashPhoto(step.imageDescription);
      }
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error("AI Generation error:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
