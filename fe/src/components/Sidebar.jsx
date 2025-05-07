import React, { useContext, useState } from "react";
import Box from "@mui/material/Box";
import { AppContext } from "../contexts/app.context";
import { Link, useNavigate } from "react-router-dom";
import { Skeleton, Typography } from "@mui/material";
import artistApis from "../apis/artists.apis";
import HttpStatusCode from "../constants/httpStatus";
import { useEffect } from "react";
import TruncatedText from "./TruncatedText";
import path from "../constants/path";
export default function Sidebar() {
  const navigate = useNavigate();
  const { profile } = useContext(AppContext);
  const [portfolioUrl, setPortfolioUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("portfolio");

  useEffect(() => {
    const getArtistProfile = async () => {
      const response = await artistApis.getArtistProfile(profile.id);
      if (response.status === HttpStatusCode.Ok) {
        setPortfolioUrl(response.data.result.portfolio_url);
        setIsLoading(false);
      }
    };
    getArtistProfile();
  }, []);

  const handleItemClick = (item, path) => {
    setSelectedItem(item);
    navigate(path);
  };

  return (
    <>
      {isLoading ? (
        <>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        </>
      ) : (
        <>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <Box
              sx={{
                padding: 5,
                borderRadius: 5,
                bgcolor: (theme) => theme.palette.darkBlue,
              }}
            >
              <img
                src={profile.avatar_url}
                width={150}
                height={150}
                style={{ objectFit: "cover", borderRadius: "50%" }}
              />
              <Typography
                sx={{
                  marginY: 4,
                  color: "white",
                  fontWeight: "500",
                  fontSize: 25,
                }}
              >
                Hồ sơ cá nhân
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Link style={{ color: "white", textDecoration: "none" }}>
                  <Typography
                    sx={{
                      fontSize: 20,
                      color:
                        selectedItem === "portfolio" ? "primary.main" : "white",
                    }}
                    onClick={() =>
                      handleItemClick("portfolio", path.artistPortfolio)
                    }
                  >
                    Quản lý portfolio
                  </Typography>
                </Link>
                <Link style={{ color: "white", textDecoration: "none" }}>
                  <Typography
                    onClick={() => {
                      handleItemClick("post", path.artistPostManagement);
                    }}
                    sx={{
                      fontSize: 20,
                      color: selectedItem === "post" ? "primary.main" : "white",
                    }}
                  >
                    Quản lý bài đăng
                  </Typography>
                </Link>
                <Link style={{ color: "white", textDecoration: "none" }}>
                  <Typography
                    onClick={() => {
                      handleItemClick("service", path.artistSericeManagement);
                    }}
                    sx={{
                      fontSize: 20,
                      color:
                        selectedItem === "service" ? "primary.main" : "white",
                    }}
                  >
                    Quản lý dịch vụ
                  </Typography>
                </Link>
                <Link style={{ color: "white", textDecoration: "none" }}>
                  <Typography
                    onClick={() => {
                      handleItemClick(
                        "schedule",
                        path.artistScheduleManagement
                      );
                    }}
                    sx={{
                      fontSize: 20,
                      color:
                        selectedItem === "schedule" ? "primary.main" : "white",
                    }}
                  >
                    Quản lý lịch trình
                  </Typography>
                </Link>
                <Link style={{ color: "white", textDecoration: "none" }}>
                  <Typography
                    onClick={() => {
                      handleItemClick("chat", path.artistChatManagement);
                    }}
                    sx={{
                      fontSize: 20,
                      color: selectedItem === "chat" ? "primary.main" : "white",
                    }}
                  >
                    Quản lý chat
                  </Typography>
                </Link>
                <Link style={{ color: "white", textDecoration: "none" }}>
                  <Typography
                    onClick={() => {
                      handleItemClick(
                        "notifications",
                        path.artistNotificationManagement
                      );
                    }}
                    sx={{
                      fontSize: 20,
                      color:
                        selectedItem === "notifications"
                          ? "primary.main"
                          : "white",
                    }}
                  >
                    Quản lý thông báo
                  </Typography>
                </Link>
              </Box>
              <Box>
                <Box sx={{ display: "flex", gap: 2 }}></Box>
              </Box>
            </Box>
            <Box
              sx={{
                paddingY: 2,
                paddingX: 5,
                borderRadius: 5,
                bgcolor: (theme) => theme.palette.darkBlue,
              }}
            >
              {portfolioUrl.map((item, index) => {
                const parsedUrl = new URL(item);
                const domain = parsedUrl.hostname;
                return (
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      alignItems: "center",
                      marginY: 2,
                    }}
                    key={item}
                  >
                    <img
                      key={index}
                      src={`https://www.google.com/s2/favicons?domain=${domain}&sz=20`}
                      alt={`icon-${index}`}
                      style={{ objectFit: "cover" }}
                    />
                    <TruncatedText
                      sx={{
                        width: "200px",
                        color: "white",
                        "& a": {
                          color: "text.primary",
                          textDecoration: "none",
                          transition: "all 0.2s",
                        },
                        "& a:hover": {
                          color: "primary.main",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {
                        <a
                          href={item}
                          style={{ color: "white" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item}
                        </a>
                      }
                    </TruncatedText>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </>
      )}
    </>
  );
}
