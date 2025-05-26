import {
  Box,
  Chip,
  InputAdornment,
  TextField,
  Grid,
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
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import artistBanner from '../../assets/artist-banner.jpg';
import miniHeader from '../../assets/mini-header.jpg';

// Running Chips Component
const RunningChips = () => {
  return (
    <Box
      sx={{
        mb: 3,
        overflow: "hidden",
        whiteSpace: "nowrap",
        position: "relative",
      }}
    >
      <motion.div
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ display: "inline-flex", gap: 2 }}
      >
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <Chip
              key={index}
              label="#skincare"
              sx={{
                backgroundColor: (theme) => theme.palette.ochre?.lightGrey || "#FFD54F",
                color: (theme) => theme.palette.ochre?.dark || "#333",
                fontWeight: 500,
                borderRadius: "999px",
                marginRight: 1,
                transition: "transform 0.3s ease, background-color 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: (theme) => theme.palette.ochre?.light || "#FFB300",
                },
              }}
            />
          ))}
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <Chip
              key={index + 10}
              label="#beauty"
              sx={{
                backgroundColor: (theme) => theme.palette.ochre?.lightGrey || "#FFD54F",
                color: (theme) => theme.palette.ochre?.dark || "#333",
                fontWeight: 500,
                borderRadius: "999px",
                marginRight: 1,
                transition: "transform 0.3s ease, background-color 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  backgroundColor: (theme) => theme.palette.ochre?.light || "#FFB300",
                },
              }}
            />
          ))}
      </motion.div>
    </Box>
  );
};

// Main layout component
const MainLayout = () => {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: { xs: 'column', md: 'row' },
      width: '100%',
      gap: { xs: 4, md: 0 },
      pt: { xs: 2, md: 6 },
      mt: { xs: 2, md: 6 }
    }}>
      {/* Left: Artist Banner (50% width) */}
      <Box
        sx={{
          width: { xs: '100%', md: '40%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          pr: { xs: 0, md: 2 },
          height: { md: '100%' }, // Ensure box has full height
        }}
      >
        <img
          src={artistBanner}
          alt="Artist Banner"
          style={{
            width: '100%',
            height: '100%',
            minHeight: '300px',
            maxHeight: '500px',
            objectFit: 'cover',
            objectPosition: 'center',
            borderRadius: '12px'
          }}
        />
      </Box>

      {/* Right: All other content (50% width) */}
      <Box
        sx={{
          width: { xs: '100%', md: '60%' },
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          pl: { xs: 0, md: 2 }
        }}
      >
        {/* Top: TypeAnimation and Search */}
        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
          }}
        >
          <TypeAnimation
            sequence={[
              'Nền tảng kết nối makeup artist', 2000,
              'Makeup hub', 1500,
            ]}
            wrapper="span"
            cursor={true}
            repeat={Infinity}
            style={{
              color: "white",
              fontSize: "32px",
              fontWeight: 600,
              textTransform: "uppercase",
              display: "block",
              marginBottom: "16px"
            }}
          />
          <TextField
            placeholder="Tìm kiếm dịch vụ..."
            size="small"
            sx={{
              width: '80%',
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

        {/* Running Chips */}
        <RunningChips />

        {/* Bottom: Product Section with Images - Equal Height and Width */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, width: '100%', height: 280 }}>
          <Box
            sx={{
              flex: 1,
              backgroundColor: "rgba(255, 255, 255, 0.25)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              padding: 3,
              borderRadius: 2,
              textAlign: "center",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <h2 style={{ margin: '0 0 16px 0', fontSize: '24px' }}>The drops that started it all</h2>
            <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.5 }}>
              No dupe about it: Our color serum drops deliver skincare-first benefits with a stunning all-over wash of color.
            </p>
          </Box>

          <Box
            sx={{
              flex: 1,
              backgroundColor: '#E1F5FE',
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden', // Added to ensure image doesn't overflow
              padding: 0 // Remove padding to allow image to fill box
            }}
          >
            <img
              src={miniHeader}
              alt="Product Image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default function Headers({ isScrolled }) {
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
    <AnimatePresence>
      <motion.div
        initial={{ height: "auto", opacity: 1 }}
        animate={{
          height: isScrolled ? 0 : "auto",
          opacity: isScrolled ? 0 : 1,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut"
        }}
        style={{
          overflow: "hidden",
          position: "relative",
          zIndex: 999
        }}
      >
        <Box
          sx={{
            backgroundImage:
              "linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)",
            borderBottomLeftRadius: { xs: "20px", sm: "100px", md: "150px" },
            borderBottomRightRadius: { xs: "20px", sm: "100px", md: "150px" },
            paddingBottom: { xs: 1, sm: 1, md: 1 },
            minHeight: { xs: 'auto', md: '80vh' },
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{
            py: { xs: 5, md: 10 },
            px: { xs: 2, sm: 4, md: 10 },
            width: '100%'
          }}>
            <MainLayout />
          </Box>

          {/* Display TypeAnimation and search field only on small screens */}
          <Grid item xs={12} sx={{ display: { xs: 'block', md: 'none' }, mt: 3, px: { xs: 2, sm: 5 } }}>
            <Box textAlign="center">
              <TypeAnimation
                sequence={[
                  'Nền tảng kết nối makeup artist', 2000,
                  'Makeup hub', 1500,
                ]}
                wrapper="span"
                cursor={true}
                repeat={Infinity}
                style={{
                  color: "white",
                  fontSize: "32px",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  display: "block",
                }}
              />
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
                    width: "100%",
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
            </Box>
          </Grid>
        </Box>
      </motion.div>
    </AnimatePresence>
  );
}

Headers.propTypes = {
  isScrolled: PropTypes.bool
};

Headers.defaultProps = {
  isScrolled: false
};