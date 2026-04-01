const express = require("express");
const cors = require("cors");
const spotifyApi = require("../spotify");

const router = express.Router();

router.post("/callback", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    
    res.json({
      accessToken: data.body.access_token,
      refreshToken: data.body.refresh_token,
      expiresIn: data.body.expires_in,
    });
  } catch (error) {
    console.error("Spotify auth error:", error);
    res.status(400).json({ error: error.message });
  }
});

// Optional: refresh token endpoint
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  
  try {
    spotifyApi.setRefreshToken(refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    
    res.json({
      accessToken: data.body.access_token,
      expiresIn: data.body.expires_in,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;