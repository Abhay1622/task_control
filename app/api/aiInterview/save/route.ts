import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { topic, difficulty, score, total, questions, userAnswers } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const assessment = await prisma.aIAssessment.create({
            data: {
                userId: user.id,
                topic,
                difficulty,
                score,
                total,
                questions,
                userAnswers,
            }
        });

        return NextResponse.json({ success: true, assessment }, { status: 201 });
    } catch (err) {
        console.error("Error saving assessment:", err);
        return NextResponse.json({ error: "Failed to save assessment" }, { status: 500 });
    }
}
