/* eslint-disable react/prop-types */
import React from "react";
import { Typography } from "@mui/material";

function TruncatedText({ children, sx = {} }) {
  return (
    <Typography
      noWrap
      sx={{
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

export default TruncatedText;
