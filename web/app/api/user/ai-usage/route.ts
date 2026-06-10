import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { aiUsage } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET() {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const monthYear = new Date().toISOString().slice(0, 7);
  const usage = await db.query.aiUsage.findFirst({
    where: and(eq(aiUsage.userId, userId), eq(aiUsage.monthYear, monthYear)),
  });

  return NextResponse.json({ generationCount: usage?.generationCount || 0 });
}
