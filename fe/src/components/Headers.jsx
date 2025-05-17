import {
  Avatar,
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../contexts/app.context";
import Popover from "./Popover";
import path from "../constants/path";
import userApis from "../apis/users.apis";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import { USER_ROLE } from "../constants/enum";
import SendIcon from "@mui/icons-material/Send";

export default function Headers() {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    setIsAuthenticated,
    profile,
    setProfile,
    role,
    setRole,
  } = useContext(AppContext);
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

  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)",
        borderBottomLeftRadius: { xs: "20px", sm: "100px", md: "150px" },
        borderBottomRightRadius: { xs: "20px", sm: "100px", md: "150px" },

        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
        paddingTop: { xs: 2, sm: 2, md: 5 },
      }}
    >
      {/* Header top */}
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
            onClick={() => <Link to={path.home} />}
            alt="header-logo"
            style={{
              width: "100px",
              height: "auto",
              objectFit: "cover",
            }}
          />
          <Link
            to={path.explore}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Typography color="white">Khám phá</Typography>
          </Link>

          <Link
            to={path.home}
            style={{ textDecoration: "none", color: "inherit" }}
          >
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

          <Link to={path.chat}>
            <SendIcon sx={{ color: "white", transform: "rotate(-45deg)" }} />
          </Link>
          {!isAuthenticated ? (
            <>
              <Link
                to={path.login}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography color="white">Đăng nhập</Typography>
              </Link>
              <Link
                to={path.register}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography color="white">Đăng kí</Typography>
              </Link>
            </>
          ) : (
            <>
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
                              backgroundColor: (theme) =>
                                theme.palette.lightGray,
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
                    width: 40,
                    height: 40,
                  }}
                />
              </Popover>
            </>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          my: { xs: 5, md: 10 },
          mx: "auto",
          px: { xs: 2, sm: 4, md: 10 },
        }}
      >
        <Box textAlign="center">
          <Typography
            textTransform="uppercase"
            color="white"
            sx={{ fontSize: { xs: "20px", sm: "28px", md: "44px" } }}
            fontWeight={500}
          >
            Một nền tảng kết nối makeup artist Makeup hub
          </Typography>

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
            {/* row 1: 4 chips */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: { lg: 4, md: 4, sm: 2, xs: 1 },
              }}
            >
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <Chip
                    key={index}
                    label="#hashtag"
                    sx={{
                      backgroundColor: (theme) => theme.palette.ochre.lightGrey,
                      color: (theme) => theme.palette.ochre.dark,
                      fontWeight: 500,
                      borderRadius: "999px",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.ochre.light,
                      },
                    }}
                    onClick={() => {}}
                  />
                ))}
            </Box>

            {/* row 2: 3 chips */}
            <Box
              sx={{
                display: "flex",
                gap: { lg: 4, md: 4, sm: 2, xs: 1 },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <Chip
                    key={index + 4}
                    label="#hashtag"
                    sx={{
                      backgroundColor: (theme) => theme.palette.ochre.lightGrey,
                      color: (theme) => theme.palette.ochre.dark,
                      fontWeight: 500,
                      borderRadius: "999px",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.ochre.light,
                      },
                    }}
                    onClick={() => {}}
                  />
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
