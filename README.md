# Spotify Artwork Gallery

## What's new
Adds an AI-powered art generation feature that creates custom album artwork for any Spotify track.

## Features
- 🎨 8 art styles (Dreamlike, Cyberpunk, Watercolor, Abstract, Retro, Nature, Cosmic, Minimal)
- 🌍 Multilingual support — transliterates Hebrew, Arabic, Chinese, Japanese, and other scripts to Latin before generating
- 💾 Generated images can be saved to user profile via localStorage
- 🔄 Auto-retry logic handles rate limiting with exponential backoff

## Tech
- Frontend: React + Tailwind CSS
- Image generation: [Pollinations.ai](https://pollinations.ai) FLUX (free, no API key required)
- Transliteration: `transliteration` npm package
- Auth: Spotify PKCE flow

## Files changed
- `client/src/pages/TrackDetail.jsx` — art generation UI
- `client/src/components/SpotifyLogin.jsx` — fixed PKCE code challenge
- `server/src/index.js` — added `/api/generate-art` proxy route
- `client/src/config/spotify.js` — hardcoded client ID and redirect URI
- `client/src/config/api.js` — hardcoded API base URL
