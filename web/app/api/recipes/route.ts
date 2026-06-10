import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recipes, ingredients, steps } from "@/lib/db/schema";
import { desc, eq, ilike, or } from "drizzle-orm";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  const category = searchParams.get("category");
  const userId = searchParams.get("userId");

  try {
    const where = [];
    if (query) {
      where.push(or(ilike(recipes.title, `%${query}%`), ilike(recipes.description, `%${query}%`)));
    }
    if (category) {
      where.push(eq(recipes.category, category));
    }
    if (userId) {
      where.push(eq(recipes.userId, userId));
    }

    const results = await db.query.recipes.findMany({
      where: where.length > 0 ? (recipes, { and }) => and(...where) : undefined,
      with: {
        user: true,
      },
      orderBy: [desc(recipes.createdAt)],
    });

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { recipe, ingredients: recipeIngredients, steps: recipeSteps } = body;

  try {
    const result = await db.transaction(async (tx) => {
      const [newRecipe] = await tx
        .insert(recipes)
        .values({
          ...recipe,
          userId,
        })
        .returning();

      if (recipeIngredients?.length) {
        await tx.insert(ingredients).values(
          recipeIngredients.map((ing: any, index: number) => ({
            ...ing,
            recipeId: newRecipe.id,
            orderIndex: index,
          }))
        );
      }

      if (recipeSteps?.length) {
        await tx.insert(steps).values(
          recipeSteps.map((step: any, index: number) => ({
            ...step,
            recipeId: newRecipe.id,
            stepNumber: index + 1,
          }))
        );
      }

      return newRecipe;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 });
  }
}
