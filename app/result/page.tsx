import { connectToDB } from "@/lib/mongodb"
import Result from "@/models/Result"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    await connectToDB()
    const { userId, quizId, score, total } = await req.json()

    const newResult = await Result.create({
      userId,
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
