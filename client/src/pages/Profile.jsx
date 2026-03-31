import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import sAndC from "../assets/sAndC.png";

export default function Profile() {
  const [cards, setCards] = useState(() => JSON.parse(localStorage.getItem("saved_cards") || "[]"));
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) { navigate("/"); return; }
    fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(setUser);
  }, []);

  const toggleLike = (id) => {
    const updated = cards.map(c => c.id === id ? { ...c, liked: !c.liked } : c);
    setCards(updated);
    localStorage.setItem("saved_cards", JSON.stringify(updated));
  };

  const deleteCard = (id) => {
    const updated = cards.filter(c => c.id !== id);
    setCards(updated);
    localStorage.setItem("saved_cards", JSON.stringify(updated));
  };

  const shareCard = (card) => {
    if (navigator.share) {
      navigator.share({
        title: `${card.trackName} — AI Art`,
        text: `Check out this AI art I made for "${card.trackName}" by ${card.artist}`,
      });
    } else {
      navigator.clipboard.writeText(`I created AI art for "${card.trackName}" by ${card.artist}`);
      alert("Share text copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0a0a0a" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-8 text-center"
        style={{ background: "linear-gradient(180deg, #0d1a2e 0%, #0a0a0a 100%)" }}>
        <img src={user?.images?.[0]?.url || sAndC}
          className="w-20 h-20 rounded-full mx-auto mb-3 object-cover ring-4 ring-green-400 ring-offset-4 ring-offset-[#0a0a0a]" alt="profile"
          onError={(e) => {e.target.src = sAndC}}
        />
        <h1 className="text-2xl font-bold">{user?.display_name}</h1>
        <p className="text-gray-500 text-sm mt-1">{user?.email}</p>
        <div className="flex justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-xl font-bold text-green-400">{cards.length}</p>
            <p className="text-gray-600 text-xs">Art Cards</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-green-400">{cards.filter(c => c.liked).length}</p>
            <p className="text-gray-600 text-xs">Liked</p>
          </div>
        </div>
      </div>

      {/* Cards grid */}
      <div className="px-5">
        <h2 className="text-xs uppercase tracking-widest text-gray-600 font-semibold mb-4">
          Your Art Cards
        </h2>

        {cards.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">🎨</p>
            <p className="text-gray-500 text-sm">No art cards yet</p>
            <button onClick={() => navigate("/dashboard")}
              className="mt-4 px-6 py-2 rounded-full text-sm font-medium text-black"
              style={{ background: "#1db954" }}>
              Generate your first card
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {cards.map((card) => (
              <div key={card.id} className="glass rounded-2xl overflow-hidden card-hover fade-up">
                <div className="relative">
                  <img src={card.generatedArt} alt={card.trackName}
                    className="w-full aspect-square object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs font-semibold truncate">{card.trackName}</p>
                    <p className="text-xs text-gray-400 truncate">{card.artist}</p>
                  </div>
                </div>

                {/* Card actions */}
                <div className="flex items-center justify-between px-3 py-2">
                  <button onClick={() => toggleLike(card.id)}
                    className={`transition-all ${card.liked ? "text-green-400" : "text-gray-600 hover:text-white"}`}>
                    <svg width="16" height="16" fill={card.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>

                  <button onClick={() => shareCard(card)}
                    className="text-gray-600 hover:text-green-400 transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
                      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98"/>
                    </svg>
                  </button>

                  <button onClick={() => deleteCard(card.id)}
                    className="text-gray-700 hover:text-red-400 transition-colors">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Logout */}
      <button onClick={() => { localStorage.clear(); navigate("/"); }}
        className="mx-5 mt-8 w-[calc(100%-40px)] py-3 rounded-2xl text-sm text-gray-500 hover:text-red-400 transition-colors glass">
        Log out
      </button>

      <Navbar user={user} />
    </div>
  );
}