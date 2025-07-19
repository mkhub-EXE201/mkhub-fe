import { Avatar, Box, Button, Tooltip } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import path from "../../constants/path";
import { AppContext } from "../../contexts/app.context";
import HttpStatusCode from "../../constants/httpStatus";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TelegramIcon from "@mui/icons-material/Telegram";
import { USER_ROLE } from "../../constants/enum";
import userApis from "../../apis/users.apis";
import toast from "react-hot-toast";
import Popover from "../Popover";
import Notification from "../Notification";
import notificationsApis from "../../apis/notifications.apis";

export default function ArtistNavbar() {
  const { profile, setRole, setIsAuthenticated, setProfile, isAuthenticated } =
    useContext(AppContext);
  const navigate = useNavigate();
  const [noti, setNoti] = useState([]);
  const [unreadNotiCount, setUnreadNotiCount] = useState(0);
  const alwaysScrolled = false;
  const [isScrolled, setIsScrolled] = useState(alwaysScrolled);

  useEffect(() => {
    if (alwaysScrolled || location.pathname !== path.home) {
      setIsScrolled(true);
    } else {
      setIsScrolled(window.scrollY > 200);
    }
  }, [location.pathname, alwaysScrolled]);

  const handleNavigation = () => {
    setRole(USER_ROLE.MEMBER);
    navigate(path.home);
  };

  const handleLogout = async () => {
    const response = await userApis.logout();
    if (response.status === HttpStatusCode.Ok) {
      setIsAuthenticated(false);
      setProfile(null);
      toast.success(response.data.message, {
        position: "top-center",
      });
    }
    navigate(path.home);
  };

  const getNotifications = async () => {
    if (!isAuthenticated || !profile?.id) return;

    try {
      const payload = {
        role: USER_ROLE.ARTIST,
        is_read: false,
      };

      const response = await notificationsApis.getAllNotifications(payload);
      if (response.status === HttpStatusCode.Ok) {
        const notifications = response.data.result || [];
        setNoti(notifications);

        if (!payload.is_read) {
          setUnreadNotiCount(notifications.length);
        }

        return notifications;
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  return (
    <Box
      sx={{
        paddingTop: { xs: 2, sm: 2, md: 5 },
        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
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
        <Link to={path.home}>
          <img
            src={logo}
            alt="header-logo"
            style={{
              width: "100px",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Link>
      </Box>
      {/* search box */}
      {/* <Box
        display="flex"
        flexDirection={"row"}
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          placeholder="Tìm kiếm"
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: "80%",
              md: "400px",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
                borderRadius: "20px",
              },
              "&:hover fieldset": {
                borderColor: "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
            "& .MuiInputLabel-root": {
              borderColor: "black",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              borderColor: "black",
            },
            "& .MuiInputBase-input::placeholder": {
              borderColor: "black",
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box> */}
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
          variant="contained"
          sx={{ borderRadius: "50px" }}
          onClick={() => handleNavigation()}
        >
          Chuyển sang chế độ người dùng
        </Button>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Tooltip
            title="lịch trình"
            onClick={() => navigate(path.artistScheduleManagement)}
          >
            <CalendarMonthIcon
              sx={{ width: 30, height: 30, ":hover": { opacity: "80%" } }}
            />
          </Tooltip>
          <Notification
            notifications={noti}
            getNotificationsByStatus={getNotifications}
            isScrolled={isScrolled}
          />
          <Tooltip title="tin nhắn">
            <TelegramIcon
              onClick={() => navigate(path.artistChatManagement)}
              sx={{ width: 30, height: 30, ":hover": { opacity: "80%" } }}
            />
          </Tooltip>
          <Popover
            renderPopover={
              <Box
                sx={{
                  position: "relative",
                  borderRadius: 1,
                  bgcolor: "white",
                }}
              >
                <Button
                  onClick={() => handleLogout()}
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
                  <LogoutIcon />
                  Đăng xuất
                </Button>
              </Box>
            }
          >
            <Avatar
              src={profile.artist_avatar_url}
              alt="avatar"
              sx={{
                width: 40,
                height: 40,
              }}
            />
          </Popover>
        </Box>
      </Box>
    </Box>
  );
}
