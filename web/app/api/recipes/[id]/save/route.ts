import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { savedRecipes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.insert(savedRecipes).values({
      userId,
      recipeId: params.id,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save recipe" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await db.delete(savedRecipes).where(
      and(eq(savedRecipes.userId, userId), eq(savedRecipes.recipeId, params.id))
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to unsave recipe" }, { status: 500 });
  }
}
