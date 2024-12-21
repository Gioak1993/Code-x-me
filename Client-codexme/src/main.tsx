import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./pages/Home.tsx";
import { Playground } from "./pages/Playground.tsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import { SignUp } from "./pages/SignUp.tsx";
import { LogIn } from "./pages/LogIn.tsx"; 
import { Challenges } from "./pages/Challenges.tsx"; 

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/challenges" element={<Challenges />} />
    </Routes>
  </BrowserRouter>
  </React.StrictMode>,
);
