// client/src/config/spotify.js
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID || "";
export const SPOTIFY_REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5173/callback";
export const SPOTIFY_SCOPES = ["user-top-read", "user-read-recently-played"];