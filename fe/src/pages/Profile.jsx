import { Box, Typography } from "@mui/material";
import React from "react";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SendIcon from "@mui/icons-material/Send";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone"; // đã là outlined
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ReviewsIcon from "@mui/icons-material/Reviews";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function Profile() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "250px",
        border: "1px solid #e0e0e0",
        paddingY: 3,
        paddingX: 2,
      }}
    >
      {/* logo */}
      <Box>
        <img src={logo} width={150} />
      </Box>
      {/* home */}
      <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
        <Box
          sx={{
            cursor: "pointer",
            paddingX: 1,
            paddingY: 2,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 2,
            ":hover": {
              borderRadius: "10px",
              backgroundColor: (theme) => theme.palette.lightGray,
            },
          }}
        >
          <HomeOutlinedIcon sx={{ width: 30, height: 30 }} />
          <Typography>Trang chủ</Typography>
        </Box>
      </Link>
      {/* search */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          paddingX: 1,
          paddingY: 2,
          cursor: "pointer",
          alignItems: "center",
          gap: 2,
          ":hover": {
            borderRadius: "10px",
            backgroundColor: (theme) => theme.palette.lightGray,
          },
        }}
      >
        <SearchOutlinedIcon sx={{ width: 30, height: 30 }} />
        <Typography>Tìm kiếm</Typography>
      </Box>
      {/* thông tin tài khoản */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingX: 1,
          paddingY: 2,
          cursor: "pointer",
          gap: 2,
          ":hover": {
            borderRadius: "10px",
            backgroundColor: (theme) => theme.palette.lightGray,
          },
        }}
      >
        <AccountCircleIcon sx={{ width: 30, height: 30 }} />
        <Typography>Thông tin tài khoản</Typography>
      </Box>
      {/* tin nhắn */}
      <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            cursor: "pointer",
            paddingX: 1,
            paddingY: 2,
            gap: 2,
            ":hover": {
              borderRadius: "10px",
              backgroundColor: (theme) => theme.palette.lightGray,
            },
          }}
        >
          <SendIcon sx={{ width: 30, height: 30 }} />
          <Typography>Tin nhắn</Typography>
        </Box>
      </Link>
      {/* thông báo */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingX: 1,
          paddingY: 2,
          cursor: "pointer",
          gap: 2,
          ":hover": {
            borderRadius: "10px",
            backgroundColor: (theme) => theme.palette.lightGray,
          },
        }}
      >
        <NotificationsNoneIcon sx={{ width: 30, height: 30 }} />
        <Typography>Thông báo</Typography>
      </Box>
      {/* Lịch hẹn */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingX: 1,
          paddingY: 2,
          cursor: "pointer",
          gap: 2,
          ":hover": {
            borderRadius: "10px",
            backgroundColor: (theme) => theme.palette.lightGray,
          },
        }}
      >
        <CalendarMonthIcon sx={{ width: 30, height: 30 }} />
        <Typography>Lịch hẹn</Typography>
      </Box>
      {/* đánh giá của tôi */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingX: 1,
          paddingY: 2,
          cursor: "pointer",
          gap: 2,
          ":hover": {
            borderRadius: "10px",
            backgroundColor: (theme) => theme.palette.lightGray,
          },
        }}
      >
        <ReviewsIcon sx={{ width: 30, height: 30 }} />
        <Typography>Đánh giá của tôi</Typography>
      </Box>
      {/* sổ địa chỉ */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingX: 1,
          paddingY: 2,
          cursor: "pointer",
          gap: 2,
          ":hover": {
            borderRadius: "10px",
            backgroundColor: (theme) => theme.palette.lightGray,
          },
        }}
      >
        <LocationOnIcon sx={{ width: 30, height: 30 }} />
        <Typography>Sổ địa chỉ</Typography>
      </Box>
    </Box>
  );
}
