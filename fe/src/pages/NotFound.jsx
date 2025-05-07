import { Box, Button } from "@mui/material";
import React from "react";
import notFound from "../assets/404.png";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
      }}
    >
      <img
        src={notFound}
        alt="404 Not Found"
        style={{ width: "100%", height: "90%", objectFit: "contain" }}
      />
      <Link to="/">
        <Button
          sx={{
            position: "relative",
            bottom: "10px",
            paddingX: 4,
            paddingY: 1,
            backgroundColor: (theme) => theme.palette.darkPink,
            color: "white",
            "&:hover": {
              backgroundColor: (theme) => theme.palette.lightPink,
            },
          }}
        >
          Quay về trang chủ
        </Button>
      </Link>
    </Box>
  );
}
