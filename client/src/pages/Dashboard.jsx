import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackCard from "../components/TrackCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem("liked_tracks") || "[]"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) { navigate("/"); return; }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("https://api.spotify.com/v1/me", { headers }).then(r => r.json()),
      fetch("https://api.spotify.com/v1/me/top/tracks?limit=20", { headers }).then(r => r.json()),
    ]).then(([u, t]) => {
      if (u.error) { navigate("/"); return; }
      setUser(u);
      setTracks(t.items || []);
      setLoading(false);
    });
  }, []);

  const toggleLike = (id) => {
    const updated = liked.includes(id) ? liked.filter(l => l !== id) : [...liked, id];
    setLiked(updated);
    localStorage.setItem("liked_tracks", JSON.stringify(updated));
  };

  const filtered = tracks.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.artists.some(a => a.name.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-500 text-sm">Loading your music...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0a0a0a" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-6"
        style={{ background: "linear-gradient(180deg, #0d1f12 0%, #0a0a0a 100%)" }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-green-400 text-xs uppercase tracking-widest font-medium">Your Music</p>
            <h1 className="text-2xl font-bold mt-1">Top Tracks 🎵</h1>
          </div>
          {user?.images?.[0]?.url && (
            <img src={user.images[0].url} onClick={() => navigate("/profile")}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400 cursor-pointer" alt="" />
          )}
        </div>
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {/* Filter tabs */}
      <div className="px-5 mb-4 flex gap-2">
        {["All", "Liked"].map(tab => (
          <button key={tab}
            onClick={() => setSearch(tab === "Liked" ? "❤️" : "")}
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background: tab === "All" && search === "" || tab === "Liked" && search === "❤️"
                ? "#1db954" : "rgba(255,255,255,0.07)",
              color: tab === "All" && search === "" || tab === "Liked" && search === "❤️"
                ? "black" : "gray"
            }}>
            {tab} {tab === "Liked" && `(${liked.length})`}
          </button>
        ))}
      </div>

      {/* Grid */}
     <div className="px-4 grid grid-cols-3 gap-2">
        {(search === "❤️"
          ? tracks.filter(t => liked.includes(t.id))
          : filtered
        ).map((track, i) => (
          <TrackCard
            key={track.id}
            track={track}
            index={i}
            liked={liked.includes(track.id)}
            onLike={toggleLike}
          />
        ))}
      </div>

      <Navbar user={user} />
    </div>
  );
}