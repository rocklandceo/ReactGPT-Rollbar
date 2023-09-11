import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

const OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_KEY;

app.post('/chat', async (req, res) => {
    const userMessage = req.body.message;

    // Prepare the request body for OpenAI
    const requestBody = {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: userMessage }],
    };

    try {
        const openaiResponse = await fetch(OPENAI_ENDPOINT, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        const data = await openaiResponse.json();
        console.log("OpenAI Response:", data);

        // Check if the expected data structure is present
        if (data && data.choices && data.choices.length > 0) {
            res.json({ response: data.choices[0].message.content });
        } else {
            console.error("Unexpected OpenAI API response format:", data);
            res.status(500).json({ error: "Unexpected response format from OpenAI API" });
        }
    } catch (error) {
        console.error("Error calling OpenAI API:", error);
        res.status(500).json({ error: "Failed to process the request" });
    }
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
