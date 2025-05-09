import React, { useContext, useEffect, useState } from "react";
import artistApis from "../../apis/artists.apis";
import { AppContext } from "../../contexts/app.context";
import { Box, Grid, Typography } from "@mui/material";
import toast from "react-hot-toast";
import HttpStatusCode from "../../constants/httpStatus";
import Skeleton from "../../components/Skeleton";

export default function ArtistPostManagement() {
  const [loading, setLoading] = useState(true);
  const { profile } = useContext(AppContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getArtistPosts = async () => {
      try {
        const response = await artistApis.getArtistPosts(profile.id);
        if (response.status === HttpStatusCode.Ok) {
          setPosts(response.data.result);
        }
      } catch (error) {
        toast.error(error.message || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getArtistPosts();
  }, [profile.id]);

  let customPosts = posts;
  if (posts.length > 0) {
    const remainder = posts.length % 3;
    if (remainder !== 0) {
      const emptySlots = 3 - remainder;
      customPosts = [...posts, ...Array(emptySlots).fill({ id: "empty" })];
    }
  }

  return (
    <Box>
      <Box sx={{ margin: 4 }}>
        {loading ? (
          <Skeleton />
        ) : (
          <Box sx={{ gap: 5 }}>
            <Box
              sx={{
                display: "flex",
                marginTop: 4,
                marginBottom: 8,
                paddingX: 3,
                alignItems: "center",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Typography
                sx={{
                  fontSize: 40,
                  fontWeight: "600",
                  color: (theme) => theme.palette.primary.main,
                }}
              >
                Bài đăng của bạn
              </Typography>
              <Typography
                sx={{
                  paddingY: 1,
                  paddingX: 2,
                  fontWeight: "500",
                  color: (theme) => theme.palette.primary.main,
                  "&:hover": {
                    cursor: "pointer",
                    borderRadius: 2,
                    bgcolor: (theme) => theme.palette.lightGray,
                  },
                }}
              >
                Thêm bài đăng mới +
              </Typography>
            </Box>
            <Grid container spacing={2} columns={12} justifyContent="center">
              {customPosts.map((post, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  {post.id === "empty" ? (
                    <Box sx={{ width: 300, height: 420 }} />
                  ) : (
                    <Box
                      sx={{
                        position: "relative",
                        "& img": {
                          transition: "all 0.3s ease",
                        },
                        "&:hover img": {
                          filter: "brightness(0.5)",
                          cursor: "pointer",
                        },
                        "&:hover .info": {
                          opacity: 1,
                          visibility: "visible",
                        },
                      }}
                    >
                      <img
                        src={post.media_url[0]}
                        width={300}
                        height={420}
                        style={{ objectFit: "cover" }}
                        alt="Artist Post"
                      />
                      <Box
                        className="info"
                        sx={{
                          position: "absolute",
                          bottom: "50%",
                          width: "100%",
                          color: "white",
                          display: "flex",
                          justifyContent: "center",
                          gap: 4,
                          alignItems: "center",
                          paddingY: 1,
                          fontSize: 14,
                          opacity: 0,
                          visibility: "hidden",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              fill="white"
                              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                            />
                          </svg>
                          <Typography sx={{ fontSize: 20, fontWeight: "500" }}>
                            12
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                          >
                            <path
                              fill="white"
                              d="M21 2H3C1.9 2 1 2.9 1 4v16l4-4h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"
                            />
                          </svg>
                          <Typography sx={{ fontSize: 20, fontWeight: "500" }}>
                            0
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
}
