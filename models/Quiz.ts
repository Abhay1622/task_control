import mongoose, { Schema, models } from 'mongoose';

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  answer: { type: String, required: true },
});

const QuizSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  questions: [QuestionSchema],
}, { timestamps: true });

const Quiz = models.Quiz || mongoose.model('Quiz', QuizSchema);
export default Quiz;
