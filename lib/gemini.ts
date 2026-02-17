
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use environment variable or fallback for now (though env var is better)
const API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyDvNwr2aNaF_rVS8LaGU8ZKyk6CvDXY-kw";

export const genAI = new GoogleGenerativeAI(API_KEY);

// using flash model for better speed/cost/availability
export const interviewModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });