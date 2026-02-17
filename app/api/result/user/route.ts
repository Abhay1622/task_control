import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const results = await prisma.result.findMany({
      where: { userId: user.id },
      include: {
        quiz: {
          select: { title: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ results }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user results:", error);
    return NextResponse.json({ error: "Failed to get results" }, { status: 500 });
  }
}