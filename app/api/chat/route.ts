import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

import education from "@/data/education.json";
import food from "@/data/food.json";
import womenHealth from "@/data/women_health.json";
import volunteer from "@/data/volunteer.json";
import internship from "@/data/internship.json";
import donation from "@/data/donation.json";

import { detectIntent } from "@/lib/intent";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { message, language } = await req.json();

    const intent = detectIntent(message);

    let context = "";

    switch (intent) {
      case "education":
        context = JSON.stringify(education, null, 2);
        break;

      case "food":
        context = JSON.stringify(food, null, 2);
        break;

      case "women_health":
        context = JSON.stringify(womenHealth, null, 2);
        break;

      case "volunteer":
        context = JSON.stringify(volunteer, null, 2);
        break;

      case "internship":
        context = JSON.stringify(internship, null, 2);
        break;

      case "donation":
        context = JSON.stringify(donation, null, 2);
        break;

      default:
        context =
          "Provide general guidance related to NayePankh Foundation.";
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: `
You are Saathi, an empathetic AI assistant for NayePankh Foundation.

Reply in ${language === "hi" ? "Hindi" : "English"}.

Detected Intent:
${intent}

Knowledge Base:
${context}

Instructions:
- Use ONLY the information provided in the Knowledge Base whenever applicable.
- Give practical, step-by-step guidance.
- Suggest next actions.
- Be warm, compassionate, and concise.
- If more details are needed, ask follow-up questions.

User Question:
${message}
`,
    });

    return NextResponse.json({
      reply: response.text,
      intent,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        reply:
          "Sorry, something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}