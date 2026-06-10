import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { message, history } = await req.json();

  try {
    const chat = geminiModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "You are Savora's AI Chef — a friendly, knowledgeable cooking assistant. Help with cooking questions, substitutions, techniques, and suggestions. Be warm, encouraging, concise. Use cooking emoji occasionally. If asked to generate a recipe, return it as JSON with isRecipe: true." }],
        },
        ...history,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return NextResponse.json({ text: response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to chat with AI Chef" }, { status: 500 });
  }
}
