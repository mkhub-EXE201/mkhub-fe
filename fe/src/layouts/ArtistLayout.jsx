/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import React from "react";
import Sidebar from "../components/Sidebar";
import ArtistNavbar from "../components/ArtistNavbar";

export default function ArtistLayout({ children }) {
  return (
    <Box>
      <ArtistNavbar />
      <Box
        sx={{
          display: "flex",
          gap: 4,
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
        <Box sx={{ flex: 8, border: "1px solid black", borderRadius: 5 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
