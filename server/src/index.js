require("dotenv").config();
const express = require("express");
const cors = require("cors");
const spotifyRoutes = require("./routes/spotify");

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://127.0.0.1:5173";
const HF_TOKEN = "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";

// Middleware
app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

// Routes
app.use("/api/spotify", spotifyRoutes);

// ── AI Art Generation (proxies to HuggingFace to avoid CORS) ──────────────
app.post("/api/generate-art", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  try {
    const hfRes = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { width: 1024, height: 1024 },
        }),
      }
    );

    if (hfRes.status === 503) return res.status(503).json({ error: "Model loading, please retry" });
    if (!hfRes.ok) return res.status(hfRes.status).json({ error: `HuggingFace error: ${hfRes.status}` });

    const imageBuffer = await hfRes.arrayBuffer();
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
