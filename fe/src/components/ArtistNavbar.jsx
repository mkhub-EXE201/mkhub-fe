import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import path from "../constants/path";
import artistApis from "../apis/artists.apis";
import { AppContext } from "../contexts/app.context";
import HttpStatusCode from "../constants/httpStatus";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NotificationsIcon from "@mui/icons-material/Notifications";
import TelegramIcon from "@mui/icons-material/Telegram";
import { USER_ROLE } from "../constants/enum";
export default function ArtistNavbar() {
  const { profile, setRole } = useContext(AppContext);
  const navigate = useNavigate();
  const [artistProfile, setArtistProfile] = useState({});

  useEffect(() => {
    const getArtistProfile = async () => {
      const response = await artistApis.getArtistProfile(profile.id);
      if (response.status === HttpStatusCode.Ok) {
        console.log(response.data.result.avatar_url);
        setArtistProfile(response.data.result);
      }
    };
    getArtistProfile();
  }, []);

  const handleNavigation = () => {
    setRole(USER_ROLE.MEMBER);
    navigate(path.home);
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
        <Link
          to={path.explore}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography>Khám phá</Typography>
        </Link>

        <Link
          to={path.home}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography>Cộng đồng</Typography>
        </Link>
      </Box>
      {/* search box */}
      <Box
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
          variant="contained"
          sx={{ borderRadius: "50px" }}
          onClick={() => handleNavigation()}
        >
          Chuyển sang chế độ người dùng
        </Button>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <CalendarMonthIcon sx={{ width: 40, height: 40 }} />
          <NotificationsIcon sx={{ width: 40, height: 40 }} />
          <TelegramIcon sx={{ width: 40, height: 40 }} />
          <img
            src={artistProfile.avatar_url}
            width={50}
            height={50}
            style={{ objectFit: "cover", borderRadius: "50%" }}
          />
        </Box>
      </Box>
    </Box>
  );
}
