const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const handleChat = async (req, res) => {
    try {
        const { message, history, currentUrl } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Please provide a message." });
        }

        // System instructions to guide the bot
        const systemInstruction = `You are a friendly, helpful customer service assistant for 'HelpBro', an online platform connecting customers with top-tier local service providers (Cleaners, Electricians, Plumbers, Mechanics, etc.). 

IMPORTANT CONTEXT:
The user is currently browsing the following page on the website: ${currentUrl || 'Unknown'}
If they ask what page they are on, or need help with their current screen, use this URL context.

STRICT RULES:
1. ONLY provide information about Customer and Service Provider features.
2. If the user asks ANYTHING about admin routes, admin dashboards, admin controls, or admin information, you MUST reply EXACTLY with: "I am not authorize to tell you this" and nothing else. Do not explain why.

HOW TO BOOK A SERVICE:
1. Go to the Home or Services page and search for the service you need.
2. Click "Book Now" on the service card.
3. Select your preferred date, time slot, and provide your delivery address.
4. Complete the secure online payment to confirm the booking.

HOW TO BECOME A PROVIDER & PLANS:
1. Click "Become a Service Provider" in the navigation menu.
2. Sign up with your details and enter the OTP sent to your email.
3. Await approval from the Admin for your profile to go live.
4. Earnings Plan: Providers keep 70% of all transaction earnings, while the HelpBro platform takes a 30% commission. There are no upfront subscription fees.

Keep answers extremely short, concise, and helpful. Do not write long paragraphs unless you are giving step-by-step instructions.`;

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
