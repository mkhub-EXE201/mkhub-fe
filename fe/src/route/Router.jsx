import React, { useContext } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Homepage from "../pages/Homepage";
import ForgotPassword from "../pages/ForgotPassword";
import Profile from "../pages/Profile";
import Explore from "../pages/Explore";
import RegisterArtist from "../pages/RegisterArtist";
import OnboardingArtist from "../pages/OnboardingArtist";
import { AppContext } from "../contexts/app.context";
import path from "../constants/path";
import NotFound from "../pages/NotFound";

export const ProtectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
};

export const RejectedRoute = () => {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

const AppRouter = () => {
  const routeElements = useRoutes([
    {
      path: path.home,
      element: <Homepage />,
    },
    {
      path: path.explore,
      element: <Explore />,
    },
    {
      path: path.forgotPassword,
      element: <ForgotPassword />,
    },
    { path: "*", element: <NotFound /> },
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        { path: path.login, element: <Login /> },
        { path: path.register, element: <Register /> },
      ],
    },
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        { path: path.onboardingArtist, element: <OnboardingArtist /> },
        { path: path.registerArtist, element: <RegisterArtist /> },
        {
          path: path.profile,
          element: <Profile />,
        },
      ],
    },
  ]);
  return routeElements;
};

export default AppRouter;
