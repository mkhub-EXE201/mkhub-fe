import React, { useContext, useState, useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import { AppContext } from "../../contexts/app.context";
import { useLocation, useNavigate } from "react-router-dom";
import { Skeleton, Typography } from "@mui/material";
import artistApis from "../../apis/artists.apis";
import HttpStatusCode from "../../constants/httpStatus";
import TruncatedText from "../TruncatedText";
import path from "../../constants/path";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [portfolioUrl, setPortfolioUrl] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [artistProfile, setArtistProfile] = useState({});
  const { profile } = useContext(AppContext);
  const [selectedItem, setSelectedItem] = useState("");
  const sidebarRef = useRef(null);

  useEffect(() => {
    // Register ScrollTrigger 
    if (!gsap.plugins.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
    }

    // Make the sidebar sticky with GSAP
    if (sidebarRef.current) {
      ScrollTrigger.create({
        trigger: sidebarRef.current,
        start: "top 16px",
        endTrigger: "html",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });
    }

    return () => {
      // Clean up ScrollTrigger when component unmounts
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isLoading]);

  useEffect(() => {
    const pathToItemMap = {
      [path.artistPortfolioManagement]: "portfolio",
      [path.artistMediaManagement]: "media",
      [path.artistPostManagement]: "post",
      [path.artistSericeManagement]: "service",
      [path.artistScheduleManagement]: "schedule",
      [path.artistChatManagement]: "chat",
      [path.artistNotificationManagement]: "notifications",
    };

    setSelectedItem(pathToItemMap[location.pathname] || "");
  }, [location.pathname]);

  useEffect(() => {
    const getArtistProfile = async () => {
      const response = await artistApis.getArtistProfile(profile.artist_id);
      if (response.status === HttpStatusCode.Ok) {
        setPortfolioUrl(response.data.result.portfolio_url);
        setArtistProfile(response.data.result);
        setIsLoading(false);
      }
    };
    getArtistProfile();
  }, []);

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <Box
      ref={sidebarRef}
      sx={{
        maxHeight: "calc(100vh - 32px)",
        overflowY: "auto",
        pb: 2,
        width: "100%",
      }}
    >
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
                src={artistProfile.avatar_url}
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
                <Typography
                  sx={{
                    fontSize: 20,
                    cursor: "pointer",
                    color:
                      selectedItem === "portfolio" ? "primary.main" : "white",
                  }}
                  onClick={() =>
                    handleItemClick(path.artistPortfolioManagement)
                  }
                >
                  Quản lý Portfolio
                </Typography>
                <Typography
                  sx={{
                    fontSize: 20,
                    cursor: "pointer",
                    color: selectedItem === "media" ? "primary.main" : "white",
                  }}
                  onClick={() => handleItemClick(path.artistMediaManagement)}
                >
                  Quản lý ảnh/video
                </Typography>
                <Typography
                  onClick={() => {
                    handleItemClick(path.artistPostManagement);
                  }}
                  sx={{
                    fontSize: 20,
                    cursor: "pointer",
                    color: selectedItem === "post" ? "primary.main" : "white",
                  }}
                >
                  Quản lý bài đăng
                </Typography>
                <Typography
                  onClick={() => {
                    handleItemClick(path.artistSericeManagement);
                  }}
                  sx={{
                    fontSize: 20,
                    cursor: "pointer",
                    color:
                      selectedItem === "service" ? "primary.main" : "white",
                  }}
                >
                  Quản lý dịch vụ
                </Typography>
                <Typography
                  onClick={() => {
                    handleItemClick(path.artistScheduleManagement);
                  }}
                  sx={{
                    fontSize: 20,
                    cursor: "pointer",
                    color:
                      selectedItem === "schedule" ? "primary.main" : "white",
                  }}
                >
                  Quản lý lịch trình
                </Typography>
                <Typography
                  onClick={() => {
                    handleItemClick(path.artistChatManagement);
                  }}
                  sx={{
                    fontSize: 20,
                    cursor: "pointer",
                    color: selectedItem === "chat" ? "primary.main" : "white",
                  }}
                >
                  Quản lý chat
                </Typography>
                <Typography
                  onClick={() => {
                    handleItemClick(path.artistNotificationManagement);
                  }}
                  sx={{
                    fontSize: 20,
                    cursor: "pointer",
                    color:
                      selectedItem === "notifications"
                        ? "primary.main"
                        : "white",
                  }}
                >
                  Quản lý thông báo
                </Typography>
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
    </Box>
  );
}
