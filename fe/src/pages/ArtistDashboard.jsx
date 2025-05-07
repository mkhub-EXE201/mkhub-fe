import { Box, Typography } from "@mui/material";
import React from "react";
import Sidebar from "../components/Sidebar";
import ArtistNavbar from "../components/ArtistNavbar";

export default function ArtistDashboard() {
  return (
    <Box>
      <ArtistNavbar />
      <Box
        sx={{
          display: "flex",
          gap: 2,
          paddingTop: { xs: 2, sm: 2, md: 5 },
          paddingX: { xs: 2, sm: 3, md: 7 },
          paddingBottom: { xs: 1, sm: 1, md: 1 },
        }}
      >
        <Box
          sx={{
            flex: 2,
          }}
        >
          <Sidebar />
        </Box>
        <Box sx={{ flex: 8, border: "1px solid red" }}></Box>
      </Box>
    </Box>
  );
}
