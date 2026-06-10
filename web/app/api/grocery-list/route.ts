import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { groceryItems } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await db.query.groceryItems.findMany({
    where: eq(groceryItems.userId, userId),
  });

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const items = Array.isArray(body) ? body : [body];

  const results = await db.insert(groceryItems).values(
    items.map(item => ({
      ...item,
      userId,
    }))
  ).returning();

  return NextResponse.json(results);
}

export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  await db.delete(groceryItems).where(and(eq(groceryItems.id, id), eq(groceryItems.userId, userId)));

  return NextResponse.json({ success: true });
}
