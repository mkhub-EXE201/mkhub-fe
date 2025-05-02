/* eslint-disable react/prop-types */
import { Box, Typography } from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { AppContext } from "../contexts/app.context";

export default function OnboardingNavBar({ content }) {
  const { profile } = useContext(AppContext);
  return (
    <Box
      sx={{
        paddingTop: { xs: 2, sm: 2, md: 4 },
        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 3 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: { xs: 2, sm: 0 },
        boxShadow: 2,
      }}
    >
      {/* left - logo & title */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Link to={"/"}>
          <img src={logo} width={150} height={"auto"} />
        </Link>
        <Typography sx={{ fontSize: 30 }}>{content}</Typography>
      </Box>
      {/* right - profile */}
      <img
        src={profile.avatar_url}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
        }}
      />
    </Box>
  );
}
