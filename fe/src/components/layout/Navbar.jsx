import {
  Avatar,
  Badge,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import logo from "../../assets/logo.png";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Link, useNavigate } from "react-router-dom";
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
}) {
  const navigate = useNavigate();
  const { isAuthenticated, profile, role, setRole } = useContext(AppContext);

  return (
    <Box
      sx={{
        // backgroundImage: "linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)",
        borderBottomLeftRadius: { xs: "20px", sm: "100px", md: "150px" },
        borderBottomRightRadius: { xs: "20px", sm: "100px", md: "150px" },
        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
        paddingTop: { xs: 2, sm: 2, md: 5 },
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
            onClick={() => navigate(path.home)} // Fixed onClick
            alt="header-logo"
            style={{
              width: "100px",
              height: "auto",
              objectFit: "cover",
            }}
          />
          <Link to={path.explore} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color="white">Khám phá</Typography>
          </Link>
          <Link to={path.home} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color="white">Cộng đồng</Typography>
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
            sx={{ borderRadius: "50px" }}
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
              <Typography sx={{ color: "white" }}>
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
          />
          <IconButton>
            <Badge badgeContent={unreadChatCount} color="error">
              <TelegramIcon sx={{ width: 30, height: 30, color: "white" }} />
            </Badge>
          </IconButton>
          {!isAuthenticated ? (
            <>
              <Link to={path.login} style={{ textDecoration: "none", color: "inherit" }}>
                <Typography color="white">Đăng nhập</Typography>
              </Link>
              <Link to={path.register} style={{ textDecoration: "none", color: "inherit" }}>
                <Typography color="white">Đăng kí</Typography>
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
                sx={{ width: 30, height: 30 }}
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
  getNotificationsByStatus: PropTypes.func.isRequired,
  unreadNotiCount: PropTypes.number,
  unreadChatCount: PropTypes.number,
  handleLogout: PropTypes.func.isRequired
};

// Default props
Navbar.defaultProps = {
  notifications: [],
  unreadNotiCount: 0,
  unreadChatCount: 0
};