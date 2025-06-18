import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import postApis from "../apis/posts.apis";
import { HttpStatusCode } from "axios";
import { useNavigate } from "react-router-dom";

export default function Gallery() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  const getPosts = async () => {
    const response = await postApis.getAllPosts();
    if (response.status === HttpStatusCode.Ok) {
      setPosts(response.data.result);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  const allMediaUrls = posts.flatMap((post) =>
    (post.media_url || []).map((url) => ({ url, artist_id: post.artist_id }))
  );
  return (
    <Box
      sx={{
        marginX: { xs: 2, sm: 6, md: 12, lg: 10 },
        marginY: 4,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          marginY: { xs: 3, sm: 3, md: 6 },
          color: (theme) => theme.palette.primary.main,
          textTransform: "uppercase",
          fontSize: {
            xs: "24px",
            sm: "44px",
            md: "44px",
          },
          fontWeight: 700,
        }}
      >
        Thư viện Mkub
      </Typography>

      <Box>
        <ImageList variant="masonry" cols={3} gap={8}>
          {allMediaUrls.map(({ url, artist_id }, index) => (
            <ImageListItem
              key={index}
              onClick={() => navigate(`/artists/${artist_id}/profile`)}
              sx={{ cursor: "pointer" }}
            >
              {url.endsWith(".mp4") || url.endsWith(".webm") ? (
                <video
                  src={url}
                  controls
                  style={{ width: "100%", borderRadius: 8 }}
                />
              ) : (
                <img
                  srcSet={`${url}?w=248&fit=crop&auto=format&dpr=2 2x`}
                  src={`${url}?w=248&fit=crop&auto=format`}
                  alt={`media-${index}`}
                  loading="lazy"
                  style={{ borderRadius: 8 }}
                />
              )}
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
    </Box>
  );
}
