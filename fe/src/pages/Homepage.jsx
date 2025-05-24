import { Box } from "@mui/material";
import React, { lazy, Suspense } from "react";
import Headers from "../components/layout/Headers";
import StatCard from "../components/home-page/StatCard";

// Lazy load components
const TopServices = lazy(() => import("../components/home-page/TopServices"));
const Offers = lazy(() => import("../components/Offers"));
const VideoCarousel = lazy(() => import("../components/home-page/VideoCarousel"));
const ArtistBanner = lazy(() => import("../components/home-page/ArtistBanner"));
const Footer = lazy(() => import("../components/layout/Footer"));

export default function Homepage() {
  return (
    <Box>
      <Headers />
      <StatCard />
      <TopServices />
      <Suspense fallback={<div style={{ height: 200 }}>Loading...</div>}>
        <Offers />
      </Suspense>
      <Suspense fallback={<div style={{ height: 300 }}>Loading...</div>}>
        <VideoCarousel />
      </Suspense>
      <Suspense fallback={<div style={{ height: 200 }}>Loading...</div>}>
        <ArtistBanner />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <Footer />
      </Suspense>
    </Box>
  );
}