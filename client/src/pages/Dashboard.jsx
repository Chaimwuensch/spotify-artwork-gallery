import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TrackCard from "../components/TrackCard";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import { generateRandomTracks } from "../utils/generateRandomTracks";
import { getAccessToken } from "../utils/spotifyAuth";
import sAndC from "../assets/sAndC.png";

export default function Dashboard() {
  const [tracks, setTracks] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");
  const [liked, setLiked] = useState(() => JSON.parse(localStorage.getItem("liked_tracks") || "[]"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = getAccessToken();
      if (!token) { navigate("/"); return; }

      const headers = { Authorization: `Bearer ${token}` };

      try {
        const userRes = await fetch("https://api.spotify.com/v1/me", { headers });
        console.log("User response status:", userRes.status);

        const u = await userRes.json();
        console.log("User data:", u);

        if (userRes.status === 401) {
          console.error("❌ Unauthorized - token is invalid or expired");
          navigate("/");
          return;
        }

        if (u.error) { 
          console.error("User API error:", u.error);
          navigate("/"); 
          return; 
        }
        setUser(u);

        // Try multiple endpoints to get tracks
        let tracksResult = null;

        // Try 1: Top tracks with different time ranges
        console.log("🔄 Attempting /me/top/tracks...");
        let tracksRes = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=long_term", { headers });
        let t = await tracksRes.json();
        console.log("Top tracks response:", { status: tracksRes.status, itemsCount: t.items?.length || 0 });

        if (t.items && t.items.length > 0) {
          console.log("✅ Got top tracks!");
          tracksResult = t.items;
        } else {
          // Try 2: Recently played tracks
          console.log("🔄 Top tracks empty, trying /me/player/recently-played...");
          tracksRes = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", { headers });
          let recentData = await tracksRes.json();
          console.log("Recently played response:", { status: tracksRes.status, itemsCount: recentData.items?.length || 0 });
          
          if (recentData.items && recentData.items.length > 0) {
            console.log("✅ Got recently played tracks!");
            // Extract track objects from recently-played items
            tracksResult = recentData.items.map(item => item.track).filter(Boolean);
          } else {
            // Try 3: Medium-term top tracks
            console.log("🔄 Recently played empty, trying medium_term top tracks...");
            tracksRes = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term", { headers });
            t = await tracksRes.json();
            console.log("Medium term tracks response:", { status: tracksRes.status, itemsCount: t.items?.length || 0 });
            
            if (t.items && t.items.length > 0) {
              console.log("✅ Got medium-term top tracks!");
              tracksResult = t.items;
            }
          }
        }

        if (tracksResult && tracksResult.length > 0) {
          setTracks(tracksResult);
        } else {
          console.warn("⚠️ No Spotify tracks found from any endpoint, using fallback");
          setTracks(generateRandomTracks(20));
        }
        setLoading(false);
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        // Use fallback - don't navigate, let user see something
        setTracks(generateRandomTracks(20));
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

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
          <img src={user?.images?.[0]?.url || sAndC} onClick={() => navigate("/profile")}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-green-400 cursor-pointer" alt="profile" 
            onError={(e) => {e.target.src = sAndC}}
          />
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