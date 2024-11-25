import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.tsx";
import { Playground } from "./pages/Playground.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Playground />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>,
);
