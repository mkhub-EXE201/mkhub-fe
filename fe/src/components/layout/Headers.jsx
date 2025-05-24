import {
  Box,
  Chip,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../contexts/app.context";
import path from "../../constants/path";
import userApis from "../../apis/users.apis";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { USER_ROLE } from "../../constants/enum";
import { io } from "socket.io-client";
import notificationsApis from "../../apis/notifications.apis";
import { TypeAnimation } from 'react-type-animation';
import { scrollLeft, scrollLeft2, animationSpeeds } from '../../styles/HomeBannerAnimation';
import Navbar from "./Navbar";

export default function Headers() {
  const navigate = useNavigate();
  const {
    setIsAuthenticated,
    profile,
    setProfile,
  } = useContext(AppContext);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [unreadNotiCount, setUnreadNotiCount] = useState(0);
  const [noti, setNoti] = useState([]);

  useEffect(() => {
    if (profile?.id) {
      getNotificationsByStatus(USER_ROLE.MEMBER.toLowerCase(), false);
    }
  }, [profile?.id]);

  useEffect(() => {
    const socket = io("http://localhost:3000", {
      transports: ["websocket"],
      withCredentials: true,
      query: {
        userId: profile?.id,
      },
    });
    socket.on("connect", () => {
      console.log("✅ Connected to socket:", socket.id);
    });

    socket.on("NOTIFICATION", (noti) => {
      // Hiển thị toast
      toast.success(noti.message, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      });
      getNotificationsByStatus(USER_ROLE.MEMBER.toLowerCase(), false);
      setUnreadNotiCount((prev) => prev + 1);
    });

    return () => {
      socket.off("NOTIFICATION");
      socket.off("connect");
    };
  }, []);

  const getNotificationsByStatus = async (role, status) => {
    const payload = {
      role,
      status,
    };
    const response = await notificationsApis.getAllNotifications(payload);
    if (response.status === HttpStatusCode.Ok) {
      setNoti(response.data.result);
      setUnreadNotiCount(response.data.result.length);
    }
  };

  const handleLogout = async () => {
    const response = await userApis.logout();
    if (response.status === HttpStatusCode.Ok) {
      setIsAuthenticated(false);
      setProfile(null);
      setNoti(null);
      toast.success(response.data.message, {
        position: "top-center",
      });
    }
    navigate(path.home);
  };

  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)",
        borderBottomLeftRadius: { xs: "20px", sm: "100px", md: "150px" },
        borderBottomRightRadius: { xs: "20px", sm: "100px", md: "150px" },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
      }}
    >
      {/* Use Navbar component for the header */}
      <Navbar
        notifications={noti}
        getNotificationsByStatus={getNotificationsByStatus}
        unreadNotiCount={unreadNotiCount}
        unreadChatCount={unreadChatCount}
        handleLogout={handleLogout}
      />

      {/* Main Content */}
      <Box
        sx={{
          my: { xs: 5, md: 10 },
          mx: "auto",
          px: { xs: 2, sm: 4, md: 10 },
        }}
      >
        <Box textAlign="center">
          <TypeAnimation
            sequence={[
              'Một nền tảng kết nối makeup artist', 2000,
              'Makeup hub', 1500,
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            style={{
              color: "white",
              fontSize: "44px",
              fontWeight: 600,
              textTransform: "uppercase",
              display: "block",
            }}
          />

          {/* Search */}
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              placeholder="Tôi đang tìm kiếm dịch vụ..."
              size="small"
              sx={{
                mt: 3,
                width: {
                  xs: "100%",
                  sm: "80%",
                  md: "600px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                    borderRadius: "20px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fff",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#fff",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* hashtag */}
          <Box
            sx={{
              marginTop: { md: 5, sm: 5, xs: 2 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { lg: 4, md: 4, sm: 2, xs: 1 },
            }}
          >
            {/* Both rows wrapped in a container to ensure synchronized movement */}
            <Box
              sx={{
                display: "inline-block",
                width: "100%"
              }}
            >
              {/* row 1: 4 chips with horizontal scrolling animation */}
              <Box
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  position: "relative",
                  mb: { lg: 3, md: 3, sm: 2, xs: 1 }
                }}
              >
                <Box
                  className="scroll-animation"
                  sx={{
                    display: "inline-flex",
                    animation: `${scrollLeft} ${animationSpeeds.medium}s linear infinite`,
                    animationPlayState: "running",
                    width: "calc(250px * 16)",
                    "&:hover": {
                      animationPlayState: "paused"
                    }
                  }}
                >
                  {Array(16).fill(0).map((_, cycle) => (
                    <Box
                      key={cycle}
                      sx={{
                        display: "flex",
                        gap: { lg: 4, md: 4, sm: 2, xs: 1 },
                        justifyContent: "center",
                        px: { lg: 2, md: 1.5, sm: 1, xs: 0.5 }
                      }}
                    >
                      {Array(4).fill(0).map((_, index) => {
                        const labels = ["#makeup", "#beauty", "#style", "#trends"];
                        return (
                          <Chip
                            key={cycle * 4 + index}
                            label={labels[index]}
                            sx={{
                              backgroundColor: (theme) => theme.palette.ochre.lightGrey,
                              color: (theme) => theme.palette.ochre.dark,
                              fontWeight: 500,
                              borderRadius: "999px",
                              transition: "transform 0.3s ease, background-color 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: (theme) => theme.palette.ochre.light,
                              },
                            }}
                            onClick={() => { }}
                          />
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              </Box>

              {/* row 2: 3 chips with optimized animation */}
              <Box
                sx={{
                  width: "100%",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  position: "relative"
                }}
              >
                <Box
                  className="scroll-animation-2"
                  sx={{
                    display: "inline-flex",
                    animation: `${scrollLeft2} ${animationSpeeds.medium}s linear infinite`,
                    animationDelay: "0s",
                    animationPlayState: "running",
                    width: "calc(220px * 16)",
                    "&:hover": {
                      animationPlayState: "paused"
                    }
                  }}
                >
                  {Array(16).fill(0).map((_, cycle) => (
                    <Box
                      key={cycle}
                      sx={{
                        display: "flex",
                        gap: { lg: 4, md: 4, sm: 2, xs: 1 },
                        justifyContent: "center",
                        px: { lg: 1.5, md: 1, sm: 0.75, xs: 0.5 }
                      }}
                    >
                      {Array(3).fill(0).map((_, index) => {
                        const labels = ["#artist", "#look", "#tutorial"];
                        return (
                          <Chip
                            key={cycle * 3 + index}
                            label={labels[index]}
                            sx={{
                              backgroundColor: (theme) => theme.palette.ochre.lightGrey,
                              color: (theme) => theme.palette.ochre.dark,
                              fontWeight: 500,
                              borderRadius: "999px",
                              transition: "transform 0.3s ease, background-color 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.05)",
                                backgroundColor: (theme) => theme.palette.ochre.light,
                              },
                            }}
                            onClick={() => { }}
                          />
                        );
                      })}
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
