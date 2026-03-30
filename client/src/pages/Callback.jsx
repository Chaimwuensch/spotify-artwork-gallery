// client/src/pages/Callback.jsx
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI } from "../config/spotify";

export default function Callback() {
  const navigate = useNavigate();
  const hasRun = useRef(false); // ✅ prevents double execution

  useEffect(() => {
    if (hasRun.current) return; // ✅ stop second run
    hasRun.current = true;

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const codeVerifier = localStorage.getItem("spotify_code_verifier");

    console.log("Code:", code);
    console.log("Code verifier:", codeVerifier);

    if (!code || !codeVerifier) {
      console.error("❌ Missing code or verifier");
      navigate("/");
      return;
    }

    // ✅ Remove verifier immediately so it can't be reused
    localStorage.removeItem("spotify_code_verifier");

    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        code_verifier: codeVerifier,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Spotify response:", data);

        if (data.error) {
          console.error("❌ Token error:", data.error, data.error_description);
          navigate("/");
          return;
        }

        localStorage.setItem("spotify_access_token", data.access_token);
        localStorage.setItem("spotify_refresh_token", data.refresh_token);
        localStorage.setItem(
          "spotify_expires_at",
          Date.now() + data.expires_in * 1000
        );

        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        navigate("/");
      });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">Connecting to Spotify...</p>
    </div>
  );
}