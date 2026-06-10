import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { recipes, ingredients, steps } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const recipe = await db.query.recipes.findFirst({
      where: eq(recipes.id, params.id),
      with: {
        user: true,
        ingredients: true,
        steps: true,
        ratings: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });

    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch recipe" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { recipe: recipeData, ingredients: ingredientsData, steps: stepsData } = body;

  try {
    const existing = await db.query.recipes.findFirst({
      where: eq(recipes.id, params.id),
    });

    if (!existing) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    if (existing.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.transaction(async (tx) => {
      await tx.update(recipes).set(recipeData).where(eq(recipes.id, params.id));

      if (ingredientsData) {
        await tx.delete(ingredients).where(eq(ingredients.recipeId, params.id));
        await tx.insert(ingredients).values(
          ingredientsData.map((ing: any, index: number) => ({
            ...ing,
            recipeId: params.id,
            orderIndex: index,
          }))
        );
      }

      if (stepsData) {
        await tx.delete(steps).where(eq(steps.recipeId, params.id));
        await tx.insert(steps).values(
          stepsData.map((step: any, index: number) => ({
            ...step,
            recipeId: params.id,
          }))
        );
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update recipe" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const existing = await db.query.recipes.findFirst({
      where: eq(recipes.id, params.id),
    });

    if (!existing) return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
    if (existing.userId !== userId) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    await db.delete(recipes).where(eq(recipes.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete recipe" }, { status: 500 });
  }
}
