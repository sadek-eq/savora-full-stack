import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { mealPlanEntries } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const weekStart = searchParams.get("weekStart");

  if (!weekStart) return NextResponse.json({ error: "weekStart is required" }, { status: 400 });

  const entries = await db.query.mealPlanEntries.findMany({
    where: and(eq(mealPlanEntries.userId, userId), eq(mealPlanEntries.weekStart, weekStart)),
    with: {
      recipe: true,
    },
  });

  return NextResponse.json(entries);
}

export async function PUT(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await req.json();

  if (id) {
    await db.update(mealPlanEntries).set(data).where(and(eq(mealPlanEntries.id, id), eq(mealPlanEntries.userId, userId)));
  } else {
    await db.insert(mealPlanEntries).values({ ...data, userId });
  }

  return NextResponse.json({ success: true });
}
