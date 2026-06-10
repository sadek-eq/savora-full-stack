import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { image, recipeName, stepInstruction } = await req.json();

  try {
    const prompt = `You are watching food being cooked. The user is making ${recipeName}, currently on step: '${stepInstruction}'. Analyze this image and provide brief, helpful feedback: Is it done? Does it need more time? Is the heat too high/low? Is the color right? Keep response to 1-2 sentences, be encouraging and specific.`;

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
    return NextResponse.json({ feedback: response.text() });
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze food" }, { status: 500 });
  }
}
