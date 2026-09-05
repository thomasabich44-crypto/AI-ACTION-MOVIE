require("dotenv").config();

const express = require("express");
const cors = require("cors");
const Groq = require("groq-sdk");

const app = express();
const PORT = 3000;

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "AI-ACTION-MOVIE Backend is running!"
    });
});

app.get("/api/movies", (req, res) => {
    res.json([
        {
            id: 1,
            title: "The Last Mission",
            genre: "Action",
            status: "Ready"
        },
        {
            id: 2,
            title: "Warrior of Ethiopia",
            genre: "Action",
            status: "Ready"
        }
    ]);
});

app.post("/api/generate", async (req, res) => {

    const { action, movieStyle } = req.body;

    if (!action || !movieStyle) {
        return res.status(400).json({
            error: "Action and movie style are required"
        });
    }

    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content:
                        "You are an AI action movie script writer. Create short cinematic action movie scenes."
                },
                {
                    role: "user",
                    content: `Create a short action movie scene.
Action: ${action}
Movie style: ${movieStyle}

Include:
- Scene description
- Character action
- Camera direction
- Short dialogue
- Cinematic ending`
                }
            ],
            model: "openai/gpt-oss-20b",
            temperature: 0.8,
            max_tokens: 500
        });

        const script = completion.choices[0]?.message?.content || "";

        res.json({
            success: true,
            action: action,
            style: movieStyle,
            status: "Script Generated",
            script: script
        });

    } catch (error) {
        console.error("Groq API Error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to generate AI movie script"
        });
    }
});

console.log(
    "Groq API Key loaded:",
    process.env.GROQ_API_KEY ? "YES" : "NO"
);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});