import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Homepage from "../pages/Homepage";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Explore from "../pages/Explore";
import RegisterArtist from "../pages/RegisterArtist";
import OnboardingArtist from "../pages/OnboardingArtist";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/register-artist" element={<RegisterArtist />} />
        <Route path="/onboarding/overview" element={<OnboardingArtist />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
