const API_KEY = "AIzaSyDvNwr2aNaF_rVS8LaGU8ZKyk6CvDXY-kw";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        console.log("Available Models:");
        (data.models || []).forEach(m => console.log(m.name));

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listModels();
