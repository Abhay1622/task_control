import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ assessments: [] });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ assessments: [] });
        }

        const assessments = await prisma.aIAssessment.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ assessments });
    } catch (err) {
        console.error("Error fetching assessments:", err);
        return NextResponse.json({ error: "Failed to fetch assessments" }, { status: 500 });
    }
}
