import { Box } from "@mui/material";
import React from "react";
import Headers from "../components/Headers";
import StatCard from "../components/StatCard";
import TopServices from "../components/TopServices";
import Offers from "../components/Offers";
import Footer from "../components/Footer";

export default function Homepage() {
  return (
    <Box>
      <Headers />
      <StatCard />
      <TopServices />
      <Offers />
      <Footer />
    </Box>
  );
}
