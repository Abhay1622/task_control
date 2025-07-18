import { connectToDB } from "@/lib/mongodb"
import Result from "@/models/Result"
import User from "@/models/User"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { quizId, score, total } = await req.json()

    await connectToDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const newResult = await Result.create({
      userId: user._id,
      quizId,
      score,
      total,
    })

    return NextResponse.json({ success: true, result: newResult }, { status: 201 })
  } catch (err) {
    console.error("Error storing result:", err)
    return NextResponse.json({ error: "Failed to store result" }, { status: 500 })
  }
}
