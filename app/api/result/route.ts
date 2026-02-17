import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateUserProgress } from "@/lib/gamification";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, score, total } = await req.json();

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const newResult = await prisma.result.create({
      data: {
        userId: user.id,
        quizId,
        score,
        total,
      }
    });

    // Update User Progress
    const xpGained = score * 10; // Simple XP formula: 10 XP per point
    const progress = await updateUserProgress(user.id, xpGained);

    return NextResponse.json({ success: true, result: newResult, progress }, { status: 201 });
  } catch (err) {
    console.error("Error storing result:", err);
    return NextResponse.json({ error: "Failed to store result" }, { status: 500 });
  }
}