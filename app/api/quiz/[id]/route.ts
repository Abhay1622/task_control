import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true }
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }
    return NextResponse.json({ quiz }, { status: 200 });
  } catch (err) {
    console.error("Failed to get quiz:", err);
    return NextResponse.json({ error: "Error fetching quiz" }, { status: 500 });
  }
}
