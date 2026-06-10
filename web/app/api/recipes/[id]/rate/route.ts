import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ratings, recipes } from "@/lib/db/schema";
import { eq, sql, and } from "drizzle-orm";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { score, comment } = await req.json();

  try {
    await db.transaction(async (tx) => {
      await tx.insert(ratings)
        .values({
          recipeId: params.id,
          userId,
          score,
          comment,
        })
        .onConflictDoUpdate({
          target: [ratings.recipeId, ratings.userId],
          set: { score, comment },
        });

      const [stats] = await tx
        .select({
          avg: sql<number>`avg(${ratings.score})`,
          count: sql<number>`count(*)`
        })
        .from(ratings)
        .where(eq(ratings.recipeId, params.id));

      await tx.update(recipes)
        .set({
          averageRating: stats.avg,
          ratingCount: Number(stats.count),
        })
        .where(eq(recipes.id, params.id));
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to rate recipe" }, { status: 500 });
  }
}
