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
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserManagement from "../pages/admin/UserManagement";
import AdminLayout from "../layouts/AdminLayout";
import { USER_ROLE } from "../constants/enum";
import ArtistLayout from "../layouts/ArtistLayout";
import ArtistPortfolio from "../pages/artist/ArtistPortfolio";

export const ProtectedRoute = () => {
  const { isAuthenticated, profile } = useContext(AppContext);
  if (!isAuthenticated) {
    if (profile?.role === USER_ROLE.MEMBER && profile?.is_artist) {
      return <Navigate to={path.artistDashboard} replace />;
    }
    if (profile?.role === USER_ROLE.MEMBER && !profile?.is_artist) {
      console.log(456);
      return <Navigate to={path.home} replace />;
    }
    if (profile?.role === USER_ROLE.ADMIN) {
      return <Navigate to={path.adminDashboard} replace />;
    }
  }
  return <Outlet />;
};

export const RejectedRoute = () => {
  const { isAuthenticated, profile } = useContext(AppContext);
  if (isAuthenticated) {
    if (profile?.role === USER_ROLE.MEMBER && !profile?.is_artist) {
      return <Navigate to={path.home} replace />;
    }
    if (profile?.role === USER_ROLE.MEMBER && profile?.is_artist) {
      return <Navigate to={path.artistDashboard} replace />;
    }
    if (profile?.role === USER_ROLE.ADMIN) {
      return <Navigate to={path.adminDashboard} replace />;
    }
  }

  return <Outlet />;
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
    {
      path: "",
      element: <ProtectedRoute />,
      children: [
        {
          path: path.adminDashboard,
          element: <AdminLayout>{<AdminDashboard />}</AdminLayout>,
        },
        {
          path: path.userManagement,
          element: <AdminLayout>{<UserManagement />}</AdminLayout>,
        },
        {
          path: path.artistPortfolioManagement,
          element: <ArtistLayout>{<ArtistPortfolio />}</ArtistLayout>,
        },
        { path: path.onboardingArtist, element: <OnboardingArtist /> },
        { path: path.registerArtist, element: <RegisterArtist /> },
        {
          path: path.profile,
          element: <Profile />,
        },
      ],
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
  ]);
  return routeElements;
};

export default AppRouter;
