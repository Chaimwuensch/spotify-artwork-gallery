# Spotify Artwork Gallery

## What's new
Adds an AI-powered art generation feature that creates custom album artwork for any Spotify track.

## Features
- 🎨 8 art styles to choose from (Dreamlike, Cyberpunk, Watercolor, Abstract, Retro, Nature, Cosmic, Minimal)
- 🌍 Multilingual support — transliterates Hebrew, Arabic, Chinese, Japanese, and other scripts to Latin before generating
- 🔒 HuggingFace API call proxied through Express backend to avoid CORS and keep token secure
- 💾 Generated images can be saved to user profile via localStorage
- 🔄 Auto-retry logic handles HuggingFace 503s (model cold starts)

## Tech
- Frontend: React + Tailwind CSS
- Image generation: HuggingFace Inference API (FLUX.1-schnell)
- Transliteration: `transliteration` npm package
- Auth: Spotify PKCE flow with correct SHA-256 code challenge

## Files changed
- `client/src/pages/TrackDetail.jsx` — new art generation UI
- `client/src/components/SpotifyLogin.jsx` — fixed PKCE code challenge
- `server/index.js` — added `/api/generate-art` proxy route
- `client/src/config/spotify.js` — updated redirect URI for new Spotify security requirements
- `vite.config.js` — added API proxy config