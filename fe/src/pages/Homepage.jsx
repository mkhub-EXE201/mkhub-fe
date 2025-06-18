import { CircularProgress, Typography, Paper } from "@mui/material";
import React, { lazy, Suspense, useEffect } from "react";
import StatCard from "../components/home-page/StatCard";
import VideoCarousel from "../components/home-page/VideoCarousel"; // Eager import
import PropTypes from "prop-types";
import Headers from "../components/layout/Headers";

// Lazy load other components
const TopServices = lazy(() => import("../components/home-page/TopServices"));
const Offers = lazy(() => import("../components/Offers"));
const ArtistBanner = lazy(() => import("../components/home-page/ArtistBanner"));
const Footer = lazy(() => import("../components/layout/Footer"));
const Gallery = lazy(() => import("../components/Gallery"));
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

StyledFallback.propTypes = {
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  text: PropTypes.string,
};

StyledFallback.defaultProps = {
  height: 200,
  text: "Chờ xíu nha...",
};

// Only one default export for the module
export default function Homepage() {
  // Use effect to handle initial scroll state
  useEffect(() => {
    // Force a scroll event to update navbar state
    window.dispatchEvent(new Event("scroll"));

    // Setup a mutation observer to watch for content changes that might affect scroll
    const observer = new MutationObserver(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
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
        <Gallery />
      </Suspense>
      <Suspense fallback={<StyledFallback height={100} />}>
        <Footer />
      </Suspense>
    </>
  );
}
