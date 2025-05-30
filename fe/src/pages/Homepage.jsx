import { CircularProgress, Typography, Paper, Box, Switch, FormControlLabel } from "@mui/material";
import React, { lazy, Suspense, useEffect, useState } from "react";
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
  // State for smooth scroll toggle
  const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(() => {
    // Get saved preference from localStorage, default to false to avoid lag
    const saved = localStorage.getItem('smoothScrollEnabled');
    return saved !== null ? saved === 'true' : false;
  });

  // Use effect to handle initial scroll state
  useEffect(() => {
    // Force a scroll event to update navbar state
    window.dispatchEvent(new Event('scroll'));

    // Setup a mutation observer to watch for content changes that might affect scroll
    const observer = new MutationObserver(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    // Start observing the document body for DOM changes
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  // Save preference when changed
  const handleSmoothScrollToggle = (event) => {
    const newValue = event.target.checked;
    setSmoothScrollEnabled(newValue);
    localStorage.setItem('smoothScrollEnabled', String(newValue));
  };

  const PageContent = () => (
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

      {/* Performance toggle - fixed at bottom right */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 999,
          backgroundColor: 'rgba(255,255,255,0.8)',
          borderRadius: 2,
          padding: '4px 12px',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)'
        }}
      >
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={smoothScrollEnabled}
              onChange={handleSmoothScrollToggle}
              color="primary"
            />
          }
          label={
            <Typography variant="caption">
              Smooth Scroll {smoothScrollEnabled ? 'On' : 'Off'}
            </Typography>
          }
          labelPlacement="start"
        />
      </Box>

      <Suspense fallback={<StyledFallback height={100} />}>
        <Footer />
      </Suspense>
    </>
  );

  return (
    <SmoothScroll enabled={smoothScrollEnabled} strength={0.5}>
      <PageContent />
    </SmoothScroll>
  );
}
