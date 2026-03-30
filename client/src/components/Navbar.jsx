import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ user }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center py-4 px-6"
      style={{ background: "rgba(10,10,10,0.95)", borderTop: "1px solid rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}>

      <button onClick={() => navigate("/dashboard")}
        className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/dashboard" ? "text-green-400" : "text-gray-500 hover:text-white"}`}>
        <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
        <span className="text-xs">Home</span>
      </button>

      <button onClick={() => navigate("/profile")}
        className={`flex flex-col items-center gap-1 transition-colors ${pathname === "/profile" ? "text-green-400" : "text-gray-500 hover:text-white"}`}>
        {user?.images?.[0]?.url
          ? <img src={user.images[0].url} className="w-6 h-6 rounded-full object-cover" alt="" />
          : <svg width="22" height="22" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
            </svg>
        }
        <span className="text-xs">Profile</span>
      </button>
    </nav>
  );
}