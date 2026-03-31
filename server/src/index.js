require("dotenv").config();
const express = require("express");
const cors = require("cors");
const spotifyRoutes = require("./routes/spotify");

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://127.0.0.1:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());
app.use("/api/spotify", spotifyRoutes);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

app.post("/api/generate-art", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Prompt is required" });

  const encoded = encodeURIComponent(prompt);

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const seed = Math.floor(Math.random() * 1000000);
      const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${seed}&model=flux`;

      const polRes = await fetch(url);

      if (polRes.status === 429) {
        console.warn(`429 rate limit, attempt ${attempt}, waiting ${attempt * 3}s...`);
        await sleep(attempt * 3000);
        continue;
      }

      if (!polRes.ok) return res.status(polRes.status).json({ error: `Image generation error: ${polRes.status}` });

      const imageBuffer = await polRes.arrayBuffer();
      res.set("Content-Type", "image/jpeg");
      return res.send(Buffer.from(imageBuffer));
    } catch (err) {
      console.error(`Attempt ${attempt} error:`, err.message);
      if (attempt < 5) await sleep(attempt * 2000);
    }
  }

  res.status(429).json({ error: "Service busy, please try again in a moment." });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
