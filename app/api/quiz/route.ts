import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const quizzes = await prisma.quiz.findMany({
      include: {
        questions: {
          select: {
            question: true,
            options: true,
            answer: true
          }
        }
      }
    });
    return NextResponse.json({ quizzes }, { status: 200 });
  } catch (err) {
    console.error("Error fetching quizzes:", err);
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, category, questions } = body;

    const newQuiz = await prisma.quiz.create({
      data: {
        title,
        category,
        questions: {
          create: questions.map((q: any) => ({
            question: q.question,
            options: q.options,
            answer: q.answer
          }))
        }
      },
      include: {
        questions: true
      }
    });

    return NextResponse.json({ success: true, quiz: newQuiz }, { status: 201 });
  } catch (err) {
    console.error("Error creating quiz:", err);
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 });
  }
}
