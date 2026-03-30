import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SpotifyLogin from "./components/SpotifyLogin";
import Callback from "./pages/Callback";
import Dashboard from "./pages/Dashboard";
import TrackDetail from "./pages/TrackDetail";
import Profile from "./pages/Profile";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("spotify_access_token");
  return token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SpotifyLogin />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/track/:id" element={<PrivateRoute><TrackDetail /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}