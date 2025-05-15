import React from "react";
import OnboardingNavBar from "../components/OnboardingNavBar";
import { Box, Button, Divider, Typography } from "@mui/material";
import learnSvg from "../assets/learn.svg";
import profileSvg from "../assets/profile.svg";
import makeupSvg from "../assets/makeup.png";
import { Link } from "react-router-dom";
import path from "../constants/path";

export default function OnboardingArtist() {
  return (
    <Box>
      <OnboardingNavBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 5,
          paddingX: 10,
          paddingY: 4,
        }}
      >
        {/* left */}
        <Box sx={{ flex: 1, padding: 2 }}>
          <Typography variant="h1">Sẵn sàng toả sáng cùng Mkub?</Typography>
          <Divider sx={{ flexGrow: 1, marginY: 3 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src={learnSvg}
              style={{ objectFit: "contain", width: 50, height: 50 }}
            />
            <Box>
              <Typography sx={{ fontWeight: "600" }}>
                Trở Thành Makeup Artist Chuyên Nghiệp trên Mkub
              </Typography>
              <Typography>
                Khám phá cơ hội kết nối với hàng ngàn khách hàng yêu thích làm
                đẹp trên Mkub.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ flexGrow: 1, marginY: 3 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src={profileSvg}
              style={{ objectFit: "contain", width: 50, height: 50 }}
            />
            <Box>
              <Typography sx={{ fontWeight: "600" }}>
                Hoàn thiện hồ sơ cá nhân
              </Typography>
              <Typography>
                Cung cấp thông tin, liên kết mạng xã hội và xây dựng hình ảnh
                chuyên nghiệp cho profile của bạn.
              </Typography>
            </Box>
          </Box>
          <Divider sx={{ flexGrow: 1, marginY: 3 }} />
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
            }}
          >
            <img
              src={makeupSvg}
              style={{ objectFit: "contain", width: 50, height: 50 }}
            />
            <Box>
              <Typography sx={{ fontWeight: "600" }}>
                Bắt đầu hành trình mới
              </Typography>
              <Typography>Đăng dịch vụ đầu tiên của bạn</Typography>
            </Box>
          </Box>
          <Link to={path.registerArtist}>
            <Button
              sx={{
                marginTop: 5,
                backgroundColor: (theme) => theme.palette.primary.main,
                color: "white",
                paddingX: 7,
                paddingY: 1,
                borderRadius: 1,
                fontWeight: "600",
              }}
            >
              Tiếp tục
            </Button>
          </Link>
        </Box>
        {/* right */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
            src="https://plus.unsplash.com/premium_photo-1726776162360-22351b3c6dde?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          />
        </Box>
      </Box>
    </Box>
  );
}
