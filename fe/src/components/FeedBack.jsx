import { Box, Rating } from "@mui/material";
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
              sx={{ mb: 2, p: 2, border: "1px solid #ccc", borderRadius: 2 }}
            >
              <Rating value={item.rating_star} readOnly />
              <Box sx={{ mt: 1 }}>{item.content}</Box>
              <Box sx={{ mt: 1, color: "gray", fontSize: 13 }}>
                {new Date(item.created_at).toLocaleString("vi-VN")}
              </Box>
            </Box>
          ))}
        </>
      )}
    </Box>
  );
}
