import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { Box } from "@mui/material";
import artistBanner1 from "../assets/artist-banner.jpg";
import artistBanner2 from "../assets/artist-banner2.jpg";
import artistBanner3 from "../assets/artist-banner3.jpg";
import artistBanner4 from "../assets/artist-banner4.jpg";
import artistBanner5 from "../assets/artist-banner5.jpg";

export default function ArtistCarousel() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const images = [
    artistBanner1,
    artistBanner2,
    artistBanner3,
    artistBanner4,
    artistBanner5,
  ];

  return (
    <Box
      sx={{
        marginX: { xs: 2, sm: 6, md: 12, lg: 10 },
        marginY: 5,
      }}
    >
      <Swiper
        slidesPerView={"auto"}
        spaceBetween={20}
        grabCursor={true}
        style={{ paddingBottom: 20 }}
      >
        {images.map((item, index) => (
          <SwiperSlide
            key={index}
            style={{
              width: "250px",
              height: "300px",
              borderRadius: "15px",
              overflow: "hidden",
              transition: "all 0.4s ease",
              transform:
                hoveredIndex === index
                  ? "scale(1.1)"
                  : hoveredIndex === null
                    ? "scale(1)"
                    : "scale(0.9)",
              opacity:
                hoveredIndex === null || hoveredIndex === index ? 1 : 0.6,
              boxShadow:
                hoveredIndex === index ? "0 8px 20px rgba(0,0,0,0.3)" : "none",
              zIndex: hoveredIndex === index ? 10 : 1,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <img
              src={item}
              alt={`Artist ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
}
