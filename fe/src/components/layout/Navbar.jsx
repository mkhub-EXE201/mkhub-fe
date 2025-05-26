import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import logo from "../../assets/logo.png";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";
import Popover from "../Popover";
import path from "../../constants/path";
import Notification from "../Notification";
import { USER_ROLE } from "../../constants/enum";
import PropTypes from 'prop-types';

export default function Navbar({
  notifications,
  getNotificationsByStatus,
  unreadNotiCount,
  unreadChatCount,
  handleLogout,
  alwaysScrolled = false,
}) {
  const navigate = useNavigate();
  const { isAuthenticated, profile, role, setRole } = useContext(AppContext);
  const location = useLocation();

  // Track scroll position for collapsing behavior
  const [isScrolled, setIsScrolled] = useState(alwaysScrolled);

  // Reset scroll state when route changes
  useEffect(() => {
    if (location.pathname === path.home) {
      setIsScrolled(window.scrollY > 200);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (alwaysScrolled) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 200;
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [alwaysScrolled, isScrolled]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundImage: isScrolled ? "#linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)" : "none",
        borderBottomLeftRadius: isScrolled ? { xs: "20px", sm: "100px", md: "50px" } : 0,
        borderBottomRightRadius: isScrolled ? { xs: "20px", sm: "100px", md: "50px" } : 0,
        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
        paddingTop: isScrolled ? { xs: 1, sm: 1.5, md: 2 } : { xs: 2, sm: 2, md: 5 },
        transition: 'all 0.3s ease',
        boxShadow: isScrolled ? '0 2px 10px rgba(0,0,0,0.1)' : 'none',
        width: "100%",
        backgroundColor: isScrolled ? "#fec9d9" : "transparent"
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          gap: { xs: 2, sm: 0 },
        }}
      >
        {/* Left */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            onClick={() => navigate(path.home)}
            alt="header-logo"
            style={{
              width: isScrolled ? "80px" : "100px",
              height: "auto",
              objectFit: "cover",
              cursor: "pointer",
              transition: "width 0.3s ease"
            }}
          />
          <Link to={path.explore} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color={isScrolled ? "black" : "white"}>Khám phá</Typography>
          </Link>
          <Link to={path.home} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color={isScrolled ? "black" : "white"}>Cộng đồng</Typography>
          </Link>
        </Box>

        {/* Right */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                navigate(path.login);
                return;
              }
              if (profile.is_artist) {
                const nextRole =
                  role === USER_ROLE.MEMBER ? USER_ROLE.ARTIST : USER_ROLE.MEMBER;
                setRole(nextRole);
                navigate(
                  nextRole === USER_ROLE.MEMBER
                    ? path.onboardingArtist
                    : path.artistPortfolioManagement
                );
              } else {
                navigate(path.onboardingArtist);
              }
            }}
            sx={{
              borderRadius: "50px",
              transform: isScrolled ? "scale(0.9)" : "scale(1)",
              transition: "transform 0.3s ease"
            }}
          >
            <Box
              sx={{
                backgroundColor: (theme) => theme.palette.darkPink,
                paddingX: 2,
                paddingY: 1,
                borderRadius: 50,
                ":hover": { opacity: "95%" },
              }}
            >
              <Typography sx={{ color: isScrolled ? "white" : "white" }}>
                {!isAuthenticated
                  ? "Trở thành Makeup Artist"
                  : role === USER_ROLE.ARTIST
                    ? "Chuyển sang chế độ User"
                    : profile.is_artist
                      ? "Chuyển sang chế độ Makeup Artist"
                      : "Trở thành Makeup Artist"}
              </Typography>
            </Box>
          </Button>
          <Notification
            notifications={notifications}
            getNotificationsByStatus={getNotificationsByStatus}
            isScrolled={isScrolled}
          />
          <IconButton>
            <Badge badgeContent={unreadChatCount} color="error">
              <TelegramIcon sx={{
                width: isScrolled ? 25 : 30,
                height: isScrolled ? 25 : 30,
                color: isScrolled ? "black" : "white",
                transition: "width 0.3s ease, height 0.3s ease"
              }} />
            </Badge>
          </IconButton>
          {!isAuthenticated ? (
            <>
              <Link to={path.login} style={{ textDecoration: "none", color: "inherit" }}>
                <Typography color={isScrolled ? "black" : "white"}>Đăng nhập</Typography>
              </Link>
              <Link to={path.register} style={{ textDecoration: "none", color: "inherit" }}>
                <Typography color={isScrolled ? "black" : "white"}>Đăng kí</Typography>
              </Link>
            </>
          ) : (
            <Popover
              renderPopover={
                <Box sx={{ position: "relative", borderRadius: 1, bgcolor: "white" }}>
                  <Box sx={{ display: "flex", flexDirection: "column", color: "black" }}>
                    <Link to={path.profile}>
                      <Button
                        sx={{
                          py: 1,
                          px: 1.5,
                          justifyContent: "flex-start",
                          color: "black",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.lightGray,
                          },
                        }}
                      >
                        Thông tin tài khoản
                      </Button>
                    </Link>
                    <Button
                      sx={{
                        mt: 1,
                        py: 1,
                        px: 1.5,
                        justifyContent: "flex-start",
                        color: "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.lightGray,
                        },
                      }}
                    >
                      Yêu cầu của tôi
                    </Button>
                    <Button
                      onClick={handleLogout}
                      sx={{
                        mt: 1,
                        py: 1,
                        px: 1.5,
                        justifyContent: "flex-start",
                        color: "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.lightGray,
                        },
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </Box>
                </Box>
              }
            >
              <Avatar
                src={
                  profile?.avatar_url ||
                  "https://mkhub.s3.us-east-1.amazonaws.com/avatar/default_avt.jpg"
                }
                alt="avatar"
                sx={{
                  width: isScrolled ? 25 : 30,
                  height: isScrolled ? 25 : 30,
                  transition: "width 0.3s ease, height 0.3s ease"
                }}
              />
            </Popover>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// Add PropTypes validation
Navbar.propTypes = {
  notifications: PropTypes.array,
  getNotificationsByStatus: PropTypes.func,
  unreadNotiCount: PropTypes.number,
  unreadChatCount: PropTypes.number,
  handleLogout: PropTypes.func
};

// Default props
Navbar.defaultProps = {
  notifications: [],
  unreadNotiCount: 0,
  unreadChatCount: 0,
  getNotificationsByStatus: () => { },
  handleLogout: () => { }
};