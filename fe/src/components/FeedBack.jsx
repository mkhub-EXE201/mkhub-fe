import { Box, Rating, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import feedbackApis from "../apis/feedbacks.apis";
import { HttpStatusCode } from "axios";
import Skeleton from "./Skeleton";

export default function FeedBack() {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);

  const getFeedbacks = async () => {
    const response = await feedbackApis.getFeedbacks();
    if (response.status === HttpStatusCode.Ok) {
      setFeedbacks(response.data.result);
    }
    setLoading(false);
  };

  useEffect(() => {
    getFeedbacks();
  }, []);

  return (
    <Box>
      {loading ? (
        <Skeleton />
      ) : (
        <>
          {feedbacks.map((item) => (
            <Box
              key={item.id}
              sx={{
                mb: 3,
                p: 3,
                border: "1px solid #e0e0e0",
                borderRadius: 3,
                boxShadow: 1,
                backgroundColor: "#fafafa",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                  component="img"
                  src={item.artist.avatar_url}
                  alt={item.artist.name}
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    objectFit: "cover",
                    mr: 2,
                    border: "2px solid #ddd",
                  }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.artist.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Dịch vụ: {item.service.service_name}
                  </Typography>
                </Box>
              </Box>

              <Rating
                value={item.rating_star}
                readOnly
                precision={0.5}
                size="small"
              />

              <Typography sx={{ mt: 1, fontStyle: "italic" }}>
                &quot;{item.content}&quot;
              </Typography>

              <Typography
                sx={{ mt: 1, color: "gray", fontSize: 12 }}
                variant="caption"
              >
                {new Date(item.created_at).toLocaleString("vi-VN")}
              </Typography>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
