import { connectToDB } from "@/lib/mongodb"
import Quiz from "@/models/Quiz"
import { NextResponse } from "next/server"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectToDB()
    const quiz = await Quiz.findById(params.id)
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }
    return NextResponse.json({ quiz }, { status: 200 })
  } catch (err) {
    console.error("Failed to get quiz:", err)
    return NextResponse.json({ error: "Error fetching quiz" }, { status: 500 })
  }
}
