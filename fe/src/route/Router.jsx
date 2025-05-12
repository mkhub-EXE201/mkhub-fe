/* eslint-disable react/prop-types */
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
import ArtistPostManagement from "../pages/artist/ArtistPostManagement";
import ArtistMedia from "../pages/artist/ArtistMedia";
import ArtistManagement from "../pages/admin/ArtistManagement";
import Artists from "../pages/Artists";
import ArtistDetail from "../pages/ArtistDetail";
import ArtistServiceManagement from "../pages/artist/ArtistServiceManagement";

export const ProtectedRoute = ({ isAdmin, isArtist }) => {
  const { isAuthenticated, role } = useContext(AppContext);

  if (!isAuthenticated) {
    return <Navigate to={path.home} replace />;
  }

  if (isAdmin && role !== USER_ROLE.ADMIN) {
    console.log(role);
    if (role === USER_ROLE.ARTIST) {
      return <Navigate to={path.artistPortfolioManagement} replace />;
    }
    return <Navigate to={path.home} replace />;
  }

  if (isArtist && role !== USER_ROLE.ARTIST) {
    console.log(role);
    if (role === USER_ROLE.ADMIN) {
      return <Navigate to={path.adminDashboard} replace />;
    }
    return <Navigate to={path.home} replace />;
  }
  return <Outlet />;
};

export const RejectedRoute = () => {
  const { isAuthenticated, role } = useContext(AppContext);

  if (isAuthenticated) {
    if (role === USER_ROLE.ARTIST) {
      return <Navigate to={path.artistPortfolioManagement} replace />;
    }
    if (role === USER_ROLE.MEMBER) {
      return <Navigate to={path.home} replace />;
    }
    if (role === USER_ROLE.ADMIN) {
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
      path: path.artists,
      element: <Artists />,
    },
    {
      path: path.artistDetail,
      element: <ArtistDetail />,
    },
    // protect route - admin
    {
      path: "",
      element: <ProtectedRoute isAdmin />,
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
          path: path.artistManagement,
          element: <AdminLayout>{<ArtistManagement />}</AdminLayout>,
        },
      ],
    },
    // protect route - artist
    {
      path: "",
      element: <ProtectedRoute isArtist />,
      children: [
        {
          path: path.artistPortfolioManagement,
          element: <ArtistLayout>{<ArtistPortfolio />}</ArtistLayout>,
        },
        {
          path: path.artistMediaManagement,
          element: <ArtistLayout>{<ArtistMedia />}</ArtistLayout>,
        },
        {
          path: path.artistPostManagement,
          element: <ArtistLayout>{<ArtistPostManagement />}</ArtistLayout>,
        },
        {
          path: path.artistSericeManagement,
          element: <ArtistLayout>{<ArtistServiceManagement />}</ArtistLayout>,
        },
      ],
    },
    // protect route - user
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
    { path: "*", element: <NotFound /> },
    // reject route
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
