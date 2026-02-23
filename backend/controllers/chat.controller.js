const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChat = async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Please provide a message." });
        }

        // System instructions to guide the bot
        const systemInstruction = "You are a friendly, helpful customer service assistant for 'HelpBro', an online platform connecting customers with top-tier local service providers (Cleaners, Electricians, Plumbers, Mechanics, etc.). Keep answers extremely short, concise, and helpful. Do not write long paragraphs.";

        // Initialize the model
        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash",
            systemInstruction: systemInstruction
        });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const responseText = result.response.text();

        return res.status(200).json({
            success: true,
            response: responseText
        });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Failed to communicate with AI.",
            error: error.message 
        });
    }
};

module.exports = {
    handleChat
};
