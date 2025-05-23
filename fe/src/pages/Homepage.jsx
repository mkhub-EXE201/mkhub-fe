import { Box } from "@mui/material";
import React from "react";
import Headers from "../components/layout/Headers";
import StatCard from "../components/home-page/StatCard";
import TopServices from "../components/home-page/TopServices";
import Offers from "../components/Offers";
import Footer from "../components/layout/Footer";
import ArtistBanner from "../components/home-page/ArtistBanner";
import VideoCarousel from "../components/home-page/VideoCarousel";

export default function Homepage() {
  return (
    <Box>
      <Headers />
      <StatCard />
      <TopServices />
      <Offers />
      <VideoCarousel />
      <ArtistBanner />
      <Footer />
    </Box>
  );
}
