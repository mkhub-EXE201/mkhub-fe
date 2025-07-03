/* eslint-disable react/prop-types */
import React from "react";
import { Rating, Typography, Box } from "@mui/material";

export default function FeedbackRating({ value, setValue }) {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Typography variant="h5" sx={{ mb: 1 }}>
        Mức độ hài lòng của bạn
      </Typography>
      <Rating
        size="large"
        name="user-rating"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      />
    </Box>
  );
}
