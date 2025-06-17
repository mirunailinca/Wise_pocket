import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Bugete from "./pages/Bugete";
import Profil from "./pages/Profil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/general" element={<HomePage />} />
        <Route path="/bugete" element={<Bugete />} />
        <Route path="/profil" element={<Profil />} />

      </Routes>
    </Router>
  );
}

export default App;
