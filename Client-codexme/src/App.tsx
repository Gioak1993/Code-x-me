import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./api/authContext";

const Home = React.lazy(() => import("./pages/Home"));
const Playground = React.lazy(() => import("./pages/Playground"));
const Challenges = React.lazy(() => import("./pages/Challenges"));
const LogIn = React.lazy(() => import("./pages/LogIn"));
const SignUp = React.lazy(() => import("./pages/SignUp"));
const Challenge = React.lazy(() => import("./pages/ChallengePage"));

export default function App() {
  return (
    <Router>
      <AuthProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/login" element={<LogIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/challenge/:id" element={<Challenge />} />
        </Routes>
      </Suspense>
      </AuthProvider>
    </Router>
  );
}
