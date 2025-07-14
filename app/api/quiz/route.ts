import { connectToDB } from "@/lib/mongodb"
import Quiz from "@/models/Quiz"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectToDB()
    const quizzes = await Quiz.find()
    return NextResponse.json({ quizzes }, { status: 200 })
  } catch (err) {
    console.error("Error fetching quizzes:", err)
    return NextResponse.json({ error: "Failed to fetch quizzes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, category, questions } = body
    await connectToDB()

    const newQuiz = await Quiz.create({
      title,
      category,
      questions,
    })

    return NextResponse.json({ success: true, quiz: newQuiz }, { status: 201 })
  } catch (err) {
    console.error("Error creating quiz:", err)
    return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
  }
}
