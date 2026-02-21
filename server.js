import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// ES Module helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// APP INITIALIZATION
const app = express();

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Serve home.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

// Health check endpoint
app.get("/api/status", (req, res) => {
  res.json({
    status: "SME Growth Bot server is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// Chat endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { message, conversation } = req.body;

    // Validate input
    if (!message || typeof message !== "string" || message.trim() === "") {
      return res.status(400).json({
        reply: "Please provide a valid message.",
      });
    }

    // Build conversation history for Gemini
    const contents = [];

    if (
      conversation &&
      Array.isArray(conversation) &&
      conversation.length > 0
    ) {
      // Add previous conversation history
      conversation.forEach((msg) => {
        contents.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.text }],
        });
      });
    }

    // Add current user message
    contents.push({
      role: "user",
      parts: [{ text: message }],
    });

    // System instruction for SME Growth Bot
    const systemInstruction = `You are SME Growth Bot, an AI-powered business advisor specializing in helping entrepreneurs evaluate and develop micro and small enterprise (SME) ideas.

Your core capabilities:
1. Business Feasibility Analysis - Evaluate business viability based on market, resources, and risk
2. Cost Estimation - Provide realistic startup cost breakdowns
3. Revenue Projections - Create conservative financial models
4. Risk Assessment - Identify potential obstacles and mitigation strategies
5. Action Planning - Suggest concrete next steps

Guidelines for responses:
- Keep recommendations realistic and grounded in emerging market context (Southeast Asia)
- Use conservative financial assumptions
- Avoid overpromising returns or underestimating challenges
- If information is missing, make reasonable assumptions and state them clearly
- Be encouraging but honest about challenges
- Provide actionable, practical advice

Response format (when relevant):
1. Business Recommendation/Evaluation
2. Estimated Startup Cost Breakdown
3. Revenue Projection (Monthly)
4. Estimated Break-Even Period
5. Risk Assessment (Low/Medium/High with mitigation)
6. Recommended Next Steps

Keep responses clear, concise, and practical. Use simple language. Include relevant emojis to improve readability.`;

    // Call Gemini API
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: systemInstruction,
    });

    const generationConfig = {
      temperature: 0.7,
      topP: 0.9,
      topK: 40,
      maxOutputTokens: 1024,
    };

    const result = await model.generateContent({
      contents: contents,
      generationConfig: generationConfig,
    });

    const response = await result.response;
    const aiReply = response.text();

    if (!aiReply) {
      return res.status(500).json({
        reply:
          "I couldn't generate a response. Please try again with a different question.",
      });
    }

    res.status(200).json({
      reply: aiReply,
    });
  } catch (error) {
    console.error("Chat API Error:", error.message);

    let errorMessage = "Sorry, something went wrong. Please try again later.";

    if (error.message.includes("API_KEY")) {
      errorMessage = "Server configuration error. Please contact support.";
    } else if (error.message.includes("network")) {
      errorMessage =
        "Network error. Please check your connection and try again.";
    }

    res.status(500).json({
      reply: errorMessage,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    reply: "An unexpected error occurred. Please try again.",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
  });
});

// START SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🌱 SME Growth Bot Server Running   ║
║   Port: ${PORT}                        
║   Status: Ready for connections      ║
╚═══════════════════════════════════════╝
  `);
});
