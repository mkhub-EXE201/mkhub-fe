import {  CircularProgress, Typography, Paper } from "@mui/material";
import React, { lazy, Suspense } from "react";
import StatCard from "../components/home-page/StatCard";
import VideoCarousel from "../components/home-page/VideoCarousel"; // Eager import
import PropTypes from 'prop-types';
import Headers from "../components/layout/Headers";
import SmoothScroll from "../layouts/SmoothScroll";

// Lazy load other components
const TopServices = lazy(() => import("../components/home-page/TopServices"));
const Offers = lazy(() => import("../components/Offers"));
const ArtistBanner = lazy(() => import("../components/home-page/ArtistBanner"));
const Footer = lazy(() => import("../components/layout/Footer"));

// Styled fallback component
const StyledFallback = ({ height, text = "Chờ xíu nha..." }) => (
  <Paper
    elevation={0}
    sx={{
      height: height || 200,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 2,
      my: 2,
      mx: "auto",
      maxWidth: "95%",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <CircularProgress color="primary" size={40} thickness={4} />
    <Typography
      variant="body1"
      sx={{
        mt: 2,
        color: "darkBlue",
        fontWeight: 500,
      }}
    >
      {text}
    </Typography>
  </Paper>
);

// Add PropTypes validation
StyledFallback.propTypes = {
  height: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string
  ]),
  text: PropTypes.string
};

// Add default props
StyledFallback.defaultProps = {
  height: 200,
  text: "Chờ xíu nha..."
};



// Only one default export for the module
export default function Homepage() {
  return (
    
  <SmoothScroll>
      <Headers />
      <StatCard />
      <Suspense fallback={<StyledFallback />}>
        <TopServices />
      </Suspense>
      <Suspense fallback={<StyledFallback />}>
        <Offers />
      </Suspense>
      <Suspense fallback={<StyledFallback />}>
        <VideoCarousel />
      </Suspense>
      <Suspense fallback={<StyledFallback />}>
        <ArtistBanner />
      </Suspense>
      <Suspense fallback={<StyledFallback height={100} />}>
        <Footer />
      </Suspense>
      
      </SmoothScroll>
  );
}
