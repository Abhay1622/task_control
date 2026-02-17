
import { NextResponse } from "next/server";
import { interviewModel } from "@/lib/gemini";

export async function POST(req: Request) {
    try {
        const { message, history, config } = await req.json();
        const { topic, jobRole } = config || {};

        const prompt = `
      You are an experienced technical interviewer for a ${jobRole || "Software Engineer"} position.
      Topic: ${topic || "General Programming"}.
      
      Your goal is to assess the candidate's knowledge.
      - Be concise. One question at a time.
      - If the candidate answers correctly, acknowledge briefly and move to the next question.
      - If the candidate struggles, offer a hint or move to an easier question.
      - If the candidate says "I don't know", move on.
      - Do not give away the answer immediately unless they are stuck.
      
      Conversation History:
      ${history.map((h: any) => `${h.role}: ${h.content}`).join("\n")}
      
      Candidate just said: "${message}"
      
      Respond strictly in JSON format:
      {
        "response": "Your next question or feedback...",
        "feedback": "Internal note on candidate's answer quality (e.g., Good/Weak/Wrong)",
        "isFinished": boolean // true if interview should end (e.g. after 5-10 questions)
      }
    `;

        const result = await interviewModel.generateContent(prompt);
        const responseText = result.response.text();

        // Cleanup JSON string (sometimes Gemini wraps in markdown blocks)
        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        try {
            const data = JSON.parse(jsonString);
            return NextResponse.json(data);
        } catch (e) {
            console.error("Failed to parse AI JSON:", jsonString);
            return NextResponse.json({
                response: responseText,
                feedback: "Error parsing AI response",
                isFinished: false
            });
        }

    } catch (error) {
        console.error("Interview API Error:", error);
        return NextResponse.json({ error: "Failed to process interview" }, { status: 500 });
    }
}
