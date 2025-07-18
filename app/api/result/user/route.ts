import { connectToDB } from "@/lib/mongodb"
import Result from "@/models/Result"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import User from "@/models/User"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const results = await Result.find({ userId: user._id })
      .populate("quizId", "title")
      .sort({ createdAt: -1 })

    return NextResponse.json({ results }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user results:", error)
    return NextResponse.json({ error: "Failed to get results" }, { status: 500 })
  }
}