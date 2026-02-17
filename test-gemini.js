const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = "AIzaSyDvNwr2aNaF_rVS8LaGU8ZKyk6CvDXY-kw"; // Corrected key

async function listModels() {
    console.log("Listing available models with key:", API_KEY.substring(0, 5) + "..." + API_KEY.slice(-4));

    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // Note: getGenerativeModel doesn't expose listModels directly on the main instance in some versions,
        // but newer SDKs do expose it via the GoogleGenerativeAI class if imported differently.
        // Let's try to just use a known model that usually works first: 'gemini-pro'

        console.log("Trying 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        console.log("Success with gemini-pro!", await result.response.text());

    } catch (error) {
        console.error("API Error:", error.message);
    }
}

listModels();
