import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import logo from "../assets/brief-logo.png";

export default function Footer() {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.darkBlue,
        height: 400,
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Grid container sx={{ height: "100%" }} spacing={10}>
        {/* Grid item: Logo */}
        <Grid item xs={12} sm={4} md={3}>
          <Box
            sx={{
              height: "100%",
              width: 600,
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <img
              src={logo}
              alt="Footer logo"
              style={{
                bottom: 0,
                left: 0,
                height: 350,
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
        {/* Grid item: Text  */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            gap: 1,
          }}
        >
          <Grid
            item
            xs={12}
            sm={8}
            md={9}
            sx={{
              color: "white",
              display: "flex",
              gap: 5,
              alignItems: "flex-start",
              padding: 2,
              marginTop: 4,
            }}
          >
            <Box sx={{ width: "220px" }}>
              <Typography fontWeight={600} fontSize={22} marginBottom={1}>
                Giới thiệu
              </Typography>
              <Typography>Giới thiệu về Mkub</Typography>
              <Typography>Tin tức & cập nhật</Typography>
            </Box>
            <Box sx={{ width: "220px" }}>
              <Typography fontWeight={600} fontSize={22} marginBottom={1}>
                Ngôn ngữ
              </Typography>
              <Typography>Tiếng Việt</Typography>
            </Box>
          </Grid>
          <Grid
            item
            xs={12}
            sm={8}
            md={9}
            sx={{
              color: "white",
              display: "flex",
              gap: 5,
              alignItems: "flex-start",
              padding: 2,
            }}
          >
            <Box sx={{ width: "220px" }}>
              <Typography fontWeight={600} fontSize={22} marginBottom={1}>
                Tài nguyên
              </Typography>
              <Typography>Nguyên tắc và cộng đồng</Typography>
              <Typography>FAQ và điều khoản</Typography>
              <Typography>Quyền riêng tư</Typography>
              <Typography>Cookie</Typography>
            </Box>
            <Box sx={{ width: "220px" }}>
              <Typography fontWeight={600} fontSize={22} marginBottom={1}>
                Sự kiện
              </Typography>
              <Typography>Ưu đãi</Typography>
              <Typography>Lịch trình</Typography>
              <Typography>Đang diễn ra</Typography>
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Box>
  );
}
