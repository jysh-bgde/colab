import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Routes, Route, BrowserRouter } from "react-router";
import "./index.css";

import Editor from "./components/Editor.jsx";
import App from "./App.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/editor/:roomId" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
