require("dotenv").config();
const express = require("express");
const cors = require("cors");
const spotifyRoutes = require("./routes/spotify");

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://127.0.0.1:5173";

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use("/api/spotify", spotifyRoutes);

// ── AI Art Generation (Pollinations.ai - free, no API key) ──────────────
app.post("/api/generate-art", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const encoded = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true`;

    const polRes = await fetch(url);

    if (!polRes.ok) return res.status(polRes.status).json({ error: `Image generation error: ${polRes.status}` });

    const imageBuffer = await polRes.arrayBuffer();
    res.set("Content-Type", "image/jpeg");
    res.send(Buffer.from(imageBuffer));
  } catch (err) {
    console.error("Art generation error:", err.message);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
