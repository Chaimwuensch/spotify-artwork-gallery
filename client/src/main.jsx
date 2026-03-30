// client/src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // ✅ imports global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <App />
);