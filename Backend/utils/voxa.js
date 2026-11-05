
import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    try {
        const apiKey = process.env.GLM_API_Key;

        if (!apiKey) {
            throw new Error("GLM_API_Key is missing from environment variables");
        }

        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "openrouter/free",
                    messages: [
                        {
                            role: "user",
                            content: message
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error?.message || `OpenRouter API error: ${response.status}`
            );
        }

        const reply = data.choices?.[0]?.message?.content;

        if (!reply) {
            throw new Error("OpenRouter returned an empty response");
        }

        return reply;

    } catch (err) {
        console.error("OpenRouter Error:", err);
        throw err;
    }
};

export default getOpenAIAPIResponse;
