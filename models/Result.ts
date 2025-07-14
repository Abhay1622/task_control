import mongoose, { Schema, models } from 'mongoose'

const ResultSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
}, { timestamps: true })

const Result = models.Result || mongoose.model('Result', ResultSchema)
export default Result
