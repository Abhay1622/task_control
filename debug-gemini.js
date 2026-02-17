const { GoogleGenerativeAI } = require("@google/generative-ai");

// Using the corrected key 'AIza...'
const API_KEY = "AIzaSyDvNwr2aNaF_rVS8LaGU8ZKyk6CvDXY-kw";

async function debugGemini() {
    console.log("Debugging Gemini API...");
    try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        // There isn't a direct listModels on genAI in all versions, but let's try to get a model and run it.
        // If 1.5-flash fails, we try pro.

        const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.0-pro"];

        for (const modelName of modelsToTry) {
            console.log(`\nTesting model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello.");
                const response = await result.response;
                console.log(`✅ Success with ${modelName}:`, response.text());
                return; // Exit on first success
            } catch (e) {
                console.error(`❌ Failed with ${modelName}:`);
                // Check for specific error messages
                if (e.message.includes("404")) {
                    console.error("   Error 404: Model not found or API not enabled.");
                } else if (e.message.includes("400")) {
                    console.error("   Error 400: Bad Request (often invalid key).");
                } else {
                    console.error("   Error:", e.message);
                }
            }
        }

        console.log("\nAll models failed. Please check if the 'Generative Language API' is enabled in your Google Cloud Console.");

    } catch (globalError) {
        console.error("Global Error:", globalError);
    }
}

debugGemini();
