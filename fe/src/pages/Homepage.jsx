import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import React, { lazy, Suspense } from "react";
import Headers from "../components/layout/Headers";
import StatCard from "../components/home-page/StatCard";
import PropTypes from 'prop-types';

// Lazy load components
const TopServices = lazy(() => import("../components/home-page/TopServices"));
const Offers = lazy(() => import("../components/Offers"));
const VideoCarousel = lazy(() => import("../components/home-page/VideoCarousel"));
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
      // backgroundColor: "lightPink",
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

export default function Homepage() {
  return (
    <Box>
      <Headers />
      <StatCard />
      <TopServices />
      <Suspense fallback={<StyledFallback height={200} text="Chờ xíu nha..." />}>
        <Offers />
      </Suspense>
      <Suspense fallback={<StyledFallback height={300} text="Chờ xíu nha..." />}>
        <VideoCarousel />
      </Suspense>
      <Suspense
        fallback={
          <StyledFallback
            height={200}
            text="Chờ xíu nha..."
          />
        }
      >
        <ArtistBanner />
      </Suspense>
      <Suspense fallback={<StyledFallback height={100} text="Chờ xíu nha..." />}>
        <Footer />
      </Suspense>
    </Box>
  );
}