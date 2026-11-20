const path = require("path");
const rateLimit = require("express-rate-limit");
const { SYSTEM_PROMPT, WHATSAPP_LINK } = require("./sheever-knowledge");

require("dotenv").config();

const express = require("express");
const cors = require("cors");


if (!process.env.PAYSTACK_SECRET_KEY) {
    console.error("Missing PAYSTACK_SECRET_KEY in .env");
    process.exit(1);
}

const app = express();

// Needed on Render so rate limiting sees each visitor's real IP
app.set("trust proxy", 1);

// Only your own site may call this API (comma-separated list in .env)
const allowedOrigins = (
    process.env.ALLOWED_ORIGINS ||
    "http://127.0.0.1:5500,http://localhost:5500"
).split(",").map(origin => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Serves the frontend from the "public" folder (which sits next to "backend")
app.use(express.static(path.join(__dirname, "..", "public")));

const PORT = process.env.PORT || 3000;


// ==========================================
// PRICES (the server's own source of truth)
// Keep in sync with your frontend product data
// ==========================================

const PRICES = {
    "signature-dress": 85000,
    "classic-blazer": 95000,
    "silk-evening-set": 110000,
    "tailored-trousers": 75000
};

// Returns the expected amount in kobo, or null if the items are invalid
function calculateExpectedAmount(items) {

    if (!Array.isArray(items) || items.length === 0) {
        return null;
    }

    let total = 0;

    for (const item of items) {

        const price = PRICES[item.id];
        const quantity = Number(item.quantity);

        if (
            !price ||
            !Number.isInteger(quantity) ||
            quantity < 1 ||
            quantity > 100
        ) {
            return null;
        }

        total += price * quantity;
    }

    return total * 100;
}


// ==========================================
// HEALTH CHECK (the homepage is served from /public,
// so this lives on its own route)
// ==========================================

app.get("/health", (req, res) => {
    res.send("Sheever Stitches backend is working!");
});


// ==========================================
// VERIFY PAYSTACK PAYMENT
// ==========================================

app.get("/verify-payment/:reference", async (req, res) => {

    const reference = req.params.reference;

    try {

        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const data = await response.json();

        if (!data.status) {
            return res.status(400).json({
                status: false,
                message: data.message || "Payment verification failed."
            });
        }

        const transaction = data.data;

        if (transaction.status !== "success") {
            return res.status(400).json({
                status: false,
                message: "Payment was not successful."
            });
        }

        if (transaction.currency !== "NGN") {
            return res.status(400).json({
                status: false,
                message: "Payment currency does not match the order."
            });
        }

        let metadata = transaction.metadata;

        if (typeof metadata === "string") {
            try { metadata = JSON.parse(metadata); }
            catch { metadata = {}; }
        }

        const expectedAmount =
            calculateExpectedAmount(metadata && metadata.items);

        if (expectedAmount === null) {
            return res.status(400).json({
                status: false,
                message: "Order details are missing or invalid."
            });
        }

        if (transaction.amount !== expectedAmount) {

            console.log("Amount mismatch:", {
                paid: transaction.amount,
                expected: expectedAmount,
                items: metadata.items
            });

            return res.status(400).json({
                status: false,
                message: "Payment amount does not match the order."
            });
        }

        res.json({
            status: true,
            message: "Payment verified successfully.",
            data: {
                reference: transaction.reference,
                amount: transaction.amount,
                currency: transaction.currency,
                paid_at: transaction.paid_at
            }
        });

    } catch (error) {

        console.error("Payment verification error:", error.message);

        res.status(500).json({
            status: false,
            message: "Unable to verify payment."
        });

    }

});

// ==========================================
// CHAT ASSISTANT (Gemini)
// ==========================================

const GEMINI_MODEL = process.env.GEMINI_MODEL;
const DAILY_LIMIT = 800;   // stays safely under the free quota; adjust to your limits

const BUSY_MESSAGE =
    "Our assistant is unavailable right now. " +
    `Please message us on WhatsApp: ${WHATSAPP_LINK}`;

if (!process.env.GEMINI_API_KEY || !GEMINI_MODEL) {
    console.warn("Chat disabled: set GEMINI_API_KEY and GEMINI_MODEL in .env");
}

const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 6,   // 6 messages per minute per visitor
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        reply: "You're sending messages quickly. Please wait a moment and try again.",
        fallback: true
    }
});

let dailyCount = 0;
let dailyDate = new Date().toDateString();

function underDailyLimit() {
    const today = new Date().toDateString();

    if (today !== dailyDate) {
        dailyDate = today;
        dailyCount = 0;
    }

    return dailyCount < DAILY_LIMIT;
}

// Keeps the last few turns, limits length, and makes sure it ends with a user message
function sanitizeHistory(messages) {

    if (!Array.isArray(messages)) return null;

    const cleaned = messages
        .slice(-8)
        .map(message => ({
            role: message && message.role === "assistant" ? "model" : "user",
            parts: [{ text: String((message && message.text) || "").slice(0, 500) }]
        }))
        .filter(message => message.parts[0].text.trim());

    while (cleaned.length && cleaned[0].role !== "user") {
        cleaned.shift();
    }

    if (!cleaned.length || cleaned[cleaned.length - 1].role !== "user") {
        return null;
    }

    return cleaned;
}

app.post("/chat", chatLimiter, async (req, res) => {

    if (!process.env.GEMINI_API_KEY || !GEMINI_MODEL || !underDailyLimit()) {
        return res.status(503).json({ reply: BUSY_MESSAGE, fallback: true });
    }

    const contents = sanitizeHistory(req.body && req.body.messages);

    if (!contents) {
        return res.status(400).json({ reply: "Please type a message." });
    }

    dailyCount++;

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": process.env.GEMINI_API_KEY
                },
                body: JSON.stringify({
                    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    contents,
                    generationConfig: {
                        temperature: 0.4,
                        maxOutputTokens: 1000
                    }
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini error:", data.error && data.error.message);
            return res.status(502).json({ reply: BUSY_MESSAGE, fallback: true });
        }

        const parts =
            (data.candidates &&
             data.candidates[0] &&
             data.candidates[0].content &&
             data.candidates[0].content.parts) || [];

        const reply = parts.map(part => part.text || "").join("").trim();

        if (!reply) {
            return res.json({ reply: BUSY_MESSAGE, fallback: true });
        }

        res.json({ reply });

    } catch (error) {

        console.error("Chat error:", error.message);

        res.status(500).json({ reply: BUSY_MESSAGE, fallback: true });

    }

});

app.listen(PORT, () => {
    console.log(`Sheever Stitches backend is running on port ${PORT}`);
});