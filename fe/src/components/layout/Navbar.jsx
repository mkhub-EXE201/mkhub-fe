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
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";
import Popover from "../Popover";
import path from "../../constants/path";
import Notification from "../Notification";
import { EMIT_TYPE, USER_ROLE } from "../../constants/enum";
import PropTypes from "prop-types";
import userApis from "../../apis/users.apis";
import HttpStatusCode from "../../constants/httpStatus";
import toast from "react-hot-toast";
import notificationsApis from "../../apis/notifications.apis";
import { io } from "socket.io-client";
import { AnimatedUnderlineLink } from "../animations/AnimatedUnderline";
import createSocket from "../../utils/socket";
export default function Navbar({
  notifications: externalNotifications,
  getNotificationsByStatus,
  unreadNotiCount: externalUnreadNotiCount,
  unreadChatCount: externalUnreadChatCount,
  handleLogout: externalHandleLogout,
  alwaysScrolled = false,
}) {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    profile,
    role,
    setRole,
    setIsAuthenticated,
    setProfile,
  } = useContext(AppContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (profile?.id && profile?.role) {
      const newSocket = createSocket(profile.id, profile.role);
      setSocket(newSocket);

      newSocket.on(EMIT_TYPE.NOTIFICATION, (noti) => {
        console.log(" Notification received:", noti);
      });

      newSocket.on(EMIT_TYPE.ARTIST_APPROVED, (notification) => {
        console.log(notification.message);
        toast.success(notification.message);
        setProfile((prev) => ({
          ...prev,
          is_artist: true,
        }));
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [profile]);

  // Notifications state
  const [noti, setNoti] = useState(externalNotifications || []);
  const [unreadNotiCount, setUnreadNotiCount] = useState(
    externalUnreadNotiCount || 0
  );
  const [unreadChatCount, setUnreadChatCount] = useState(
    externalUnreadChatCount || 0
  );

  const handleLogout = async () => {
    try {
      const response = await userApis.logout();
      if (response.status === HttpStatusCode.Ok) {
        setIsAuthenticated(false);
        setProfile(null);
        toast.success(response.data.message, {
          position: "top-center",
        });
      }
      navigate(path.home);
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Đăng xuất thất bại. Vui lòng thử lại sau.", {
        position: "top-center",
      });
    }
  };

  // Function to get notifications
  const getNotifications = async (roleValue, isRead) => {
    if (!isAuthenticated || !profile?.id) return;

    try {
      const payload = {
        role: roleValue,
        is_read: isRead,
      };

      const response = await notificationsApis.getAllNotifications(payload);
      if (response.status === HttpStatusCode.Ok) {
        const notifications = response.data.result || [];
        setNoti(notifications);

        if (isRead === false) {
          setUnreadNotiCount(notifications.length);
        }

        return notifications;
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  // Track scroll position for collapsing behavior
  const [isScrolled, setIsScrolled] = useState(alwaysScrolled);

  // Set up socket connection for real-time notifications
  useEffect(() => {
    if (!isAuthenticated || !profile?.id) return;
    let socket;
    try {
      const socketUrl = import.meta.env.VITE_API_BASE_URL;

      socket = io(socketUrl, {
        transports: ["websocket"],
        withCredentials: true,
        query: {
          userId: profile.id,
        },
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      socket.on("connect", () => {
        console.log("✅ Connected to socket:", socket.id);
      });

      socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err.message);
      });

      socket.on("NOTIFICATION", (notification) => {
        toast.success(notification.message, {
          position: "top-right",
          duration: 3000,
        });

        // Refresh unread notifications
        getNotifications(role.toLowerCase(), false);
        setUnreadNotiCount((prev) => prev + 1);
      });

      // Initial fetch of notifications
      getNotifications(role.toLowerCase(), false);

      return () => {
        socket.off("NOTIFICATION");
        socket.off("connect");
        socket.off("connect_error");
        socket.disconnect();
      };
    } catch (error) {
      console.error("Socket initialization error:", error);
    }
  }, [isAuthenticated, profile?.id, role]);

  // Reset scroll state when route changes
  useEffect(() => {
    if (alwaysScrolled || location.pathname !== path.home) {
      setIsScrolled(true);
    } else {
      setIsScrolled(window.scrollY > 200);
    }
  }, [location.pathname, alwaysScrolled]);

  useEffect(() => {
    if (alwaysScrolled || location.pathname !== path.home) {
      setIsScrolled(true);
      return;
    }

    const handleScroll = () => {
      const shouldBeScrolled = window.scrollY > 200;
      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysScrolled, isScrolled, location.pathname]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundImage: isScrolled
          ? "#linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)"
          : "none",
        borderBottomLeftRadius: isScrolled
          ? { xs: "20px", sm: "100px", md: "50px" }
          : 0,
        borderBottomRightRadius: isScrolled
          ? { xs: "20px", sm: "100px", md: "50px" }
          : 0,
        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
        paddingTop: isScrolled
          ? { xs: 1, sm: 1.5, md: 2 }
          : { xs: 2, sm: 2, md: 5 },
        transition: "all 0.3s ease",
        boxShadow: isScrolled ? "0 2px 10px rgba(0,0,0,0.1)" : "none",
        width: "100%",
        backgroundColor: isScrolled ? "#fec9d9" : "transparent",
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
              transition: "width 0.3s ease",
            }}
          />
          <AnimatedUnderlineLink
            to={path.explore}
            label="Khám phá"
            isScrolled={isScrolled}
          />
          <AnimatedUnderlineLink
            to={path.community}
            label="Cộng đồng"
            isScrolled={isScrolled}
          />
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
                  role === USER_ROLE.MEMBER
                    ? USER_ROLE.ARTIST
                    : USER_ROLE.MEMBER;
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
              transition: "transform 0.3s ease",
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
                    : profile?.is_artist
                      ? "Chuyển sang chế độ Makeup Artist"
                      : "Trở thành Makeup Artist"}
              </Typography>
            </Box>
          </Button>
          <Notification
            notifications={noti}
            getNotificationsByStatus={getNotifications}
            isScrolled={isScrolled}
          />
          <IconButton>
            <Badge badgeContent={unreadChatCount} color="error">
              <TelegramIcon
                onClick={() => navigate(path.clientChatManagement)}
                sx={{
                  width: isScrolled ? 25 : 30,
                  height: isScrolled ? 25 : 30,
                  color: isScrolled ? "black" : "white",
                  transition: "width 0.3s ease, height 0.3s ease",
                }}
              />
            </Badge>
          </IconButton>
          {!isAuthenticated ? (
            <>
              <AnimatedUnderlineLink
                to={path.login}
                label="Đăng nhập"
                isScrolled={isScrolled}
              />
              <AnimatedUnderlineLink
                to={path.register}
                label="Đăng kí"
                isScrolled={isScrolled}
              />
            </>
          ) : (
            <Popover
              renderPopover={
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      color: "black",
                    }}
                  >
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
                  transition: "width 0.3s ease, height 0.3s ease",
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
  handleLogout: PropTypes.func,
  alwaysScrolled: PropTypes.bool,
};

// Default props
Navbar.defaultProps = {
  notifications: [],
  unreadNotiCount: 0,
  unreadChatCount: 0,
  getNotificationsByStatus: () => {},
  handleLogout: () => {},
  alwaysScrolled: false,
};
