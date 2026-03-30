import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { transliterate } from "transliteration";

const ART_STYLES = [
  { id: "dreamlike",  label: "Dreamlike",  emoji: "🌌", desc: "surreal, ethereal, floating clouds, soft light" },
  { id: "cyberpunk",  label: "Cyberpunk",  emoji: "🤖", desc: "neon lights, dark city, futuristic, glitch art" },
  { id: "watercolor", label: "Watercolor", emoji: "🎨", desc: "soft watercolor painting, pastel tones, artistic brush strokes" },
  { id: "abstract",   label: "Abstract",   emoji: "🔮", desc: "bold geometric shapes, vivid colors, abstract expressionism" },
  { id: "retro",      label: "Retro",      emoji: "📼", desc: "80s synthwave, vaporwave, retro neon grid, vintage" },
  { id: "nature",     label: "Nature",     emoji: "🌿", desc: "lush forest, golden hour, organic textures, earthy tones" },
  { id: "cosmic",     label: "Cosmic",     emoji: "🪐", desc: "deep space, nebula, stars, galaxies, cosmic energy" },
  { id: "minimal",    label: "Minimal",    emoji: "◻️", desc: "clean lines, minimal design, black and white, simple shapes" },
];

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export default function TrackDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const track = state?.track;

  const [selectedStyle, setSelectedStyle] = useState(ART_STYLES[0]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  if (!track) { navigate("/dashboard"); return null; }

  const generateArt = async () => {
    setLoading(true);
    setSaved(false);
    setImage(null);
    setError(null);

    const trackName = transliterate(track.name) || "music";
    const artistName = track.artists.map(a => transliterate(a.name)).join(", ") || "artist";
    const prompt = `Album artwork for "${trackName}" by ${artistName}. Style: ${selectedStyle.desc}. High quality digital art, no text, no words.`;

    console.log("Prompt:", prompt);

    for (let attempt = 1; attempt <= 4; attempt++) {
      try {
        const res = await fetch("/api/generate-art", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });

        if (res.status === 503) {
          console.warn(`Model loading, retrying... (attempt ${attempt})`);
          await sleep(attempt * 5000);
          continue;
        }

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const blob = await res.blob();
        if (!blob || blob.size === 0) throw new Error("Empty response");

        setImage(URL.createObjectURL(blob));
        setLoading(false);
        return;
      } catch (err) {
        if (attempt < 4) {
          console.warn(`Attempt ${attempt} failed: ${err.message}, retrying...`);
          await sleep(attempt * 2000);
        } else {
          setError("Image generation failed. Try again in a moment.");
          setLoading(false);
        }
      }
    }
  };

  const saveCard = () => {
    const existing = JSON.parse(localStorage.getItem("saved_cards") || "[]");
    const card = {
      id: `${track.id}-${Date.now()}`,
      trackName: track.name,
      artist: track.artists.map(a => a.name).join(", "),
      albumArt: track.album.images[0]?.url,
      generatedArt: image,
      style: selectedStyle.label,
      savedAt: new Date().toISOString(),
      liked: false,
    };
    localStorage.setItem("saved_cards", JSON.stringify([card, ...existing]));
    setSaved(true);
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "#0a0a0a" }}>

      {/* Back */}
      <div className="px-5 pt-10 mb-6">
        <button onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
          Back
        </button>
      </div>

      {/* Track info */}
      <div className="px-5 flex items-center gap-4 mb-8">
        <img src={track.album.images[1]?.url}
          className="w-20 h-20 rounded-2xl object-cover shadow-2xl shrink-0" alt="" />
        <div className="min-w-0">
          <p className="text-green-400 text-xs uppercase tracking-widest font-medium mb-1">Generate Art</p>
          <h1 className="text-xl font-bold leading-tight truncate">{track.name}</h1>
          <p className="text-gray-400 text-sm mt-0.5 truncate">
            {track.artists.map(a => a.name).join(", ")}
          </p>
          <p className="text-gray-600 text-xs mt-0.5 truncate">{track.album.name}</p>
        </div>
      </div>

      {/* Style picker */}
      <div className="px-5 mb-6">
        <p className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-3">Choose a style</p>
        <div className="grid grid-cols-4 gap-2">
          {ART_STYLES.map((style) => (
            <button key={style.id}
              onClick={() => { setSelectedStyle(style); setImage(null); setSaved(false); setError(null); }}
              className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-2xl transition-all"
              style={{
                background: selectedStyle.id === style.id ? "rgba(29,185,84,0.15)" : "rgba(255,255,255,0.04)",
                border: selectedStyle.id === style.id ? "1px solid rgba(29,185,84,0.5)" : "1px solid rgba(255,255,255,0.06)",
                transform: selectedStyle.id === style.id ? "scale(1.04)" : "scale(1)",
              }}>
              <span className="text-xl">{style.emoji}</span>
              <span className={`text-[10px] font-medium text-center leading-tight ${
                selectedStyle.id === style.id ? "text-green-400" : "text-gray-500"
              }`}>
                {style.label}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-3 px-3 py-2 rounded-xl"
          style={{ background: "rgba(29,185,84,0.07)", border: "1px solid rgba(29,185,84,0.15)" }}>
          <p className="text-xs text-gray-400">
            <span className="text-green-400 font-medium">{selectedStyle.emoji} {selectedStyle.label}:</span>{" "}
            {selectedStyle.desc}
          </p>
        </div>
      </div>

      {/* Generate button */}
      <div className="px-5 mb-6">
        <button onClick={generateArt} disabled={loading}
          className="w-full py-4 rounded-2xl font-semibold text-black transition-all flex items-center justify-center gap-2 text-sm"
          style={{ background: loading ? "#145a32" : "#1db954", opacity: loading ? 0.8 : 1 }}>
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
              Creating your {selectedStyle.label} art...
            </>
          ) : (
            <>{selectedStyle.emoji} Generate {selectedStyle.label} Art</>
          )}
        </button>
        <p className="text-center text-gray-700 text-xs mt-2">Free · Powered by FLUX</p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="px-5">
          <div className="w-full aspect-square rounded-3xl animate-pulse flex items-center justify-center"
            style={{ background: "rgba(255,255,255,0.04)" }}>
            <div className="text-center">
              <div className="text-4xl mb-3 animate-bounce">{selectedStyle.emoji}</div>
              <p className="text-gray-600 text-sm">Generating your art...</p>
              <p className="text-gray-700 text-xs mt-1">This takes ~10–20 seconds</p>
            </div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="px-5">
          <div className="w-full rounded-3xl p-6 text-center"
            style={{ background: "rgba(255,59,48,0.08)", border: "1px solid rgba(255,59,48,0.2)" }}>
            <p className="text-4xl mb-3">😞</p>
            <p className="text-red-400 text-sm font-medium mb-1">Generation failed</p>
            <p className="text-gray-600 text-xs mb-4">{error}</p>
            <button onClick={generateArt}
              className="px-6 py-2 rounded-full text-sm font-medium text-black"
              style={{ background: "#1db954" }}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Generated image */}
      {image && !loading && (
        <div className="px-5 fade-up">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{selectedStyle.emoji}</span>
            <span className="text-xs text-gray-400">
              <span className="text-green-400 font-medium">{selectedStyle.label}</span> · "{track.name}"
            </span>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-4">
            <img src={image} alt="AI generated art" className="w-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3"
              style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
              <p className="text-sm font-semibold truncate">{track.name}</p>
              <p className="text-xs text-gray-400 truncate">
                {track.artists.map(a => a.name).join(", ")} · {selectedStyle.label}
              </p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <button onClick={saveCard} disabled={saved}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5"
              style={{
                background: saved ? "rgba(29,185,84,0.15)" : "rgba(29,185,84,0.9)",
                color: saved ? "#1db954" : "black",
                border: saved ? "1px solid rgba(29,185,84,0.3)" : "none",
              }}>
              {saved ? "✓ Saved!" : "Save to Profile"}
            </button>

            <button onClick={generateArt}
              className="px-4 py-3 rounded-2xl text-sm font-medium text-gray-400 hover:text-white transition-colors glass">
              🔄
            </button>

            <button onClick={() => navigate("/profile")}
              className="px-4 py-3 rounded-2xl text-sm font-medium text-gray-400 hover:text-white transition-colors glass">
              👤
            </button>
          </div>

          <p className="text-center text-gray-700 text-xs">
            Tap a different style above and regenerate ✨
          </p>
        </div>
      )}
    </div>
  );
}