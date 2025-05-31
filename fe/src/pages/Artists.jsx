import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { Box, Rating, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import artistApis from "../apis/artists.apis";
import Navbar from "../components/layout/Navbar";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";
import Skeleton from "../components/Skeleton";
import PlaceIcon from "@mui/icons-material/Place";
import { Link } from "react-router-dom";
import path from "../constants/path";
import Footer from "../components/layout/Footer";

export default function Artists() {
  const [artists, setArtists] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getArtists = async () => {
      try {
        const response = await artistApis.getAllArtists();
        if (response.status === HttpStatusCode.Ok) {
          setArtists(response.data.result);
        }
      } catch (error) {
        toast.error(error.message || error.response.data.msg);
      } finally {
        setIsLoading(false);
      }
    };
    getArtists();
  }, []);
  return (
    <Box>
      <Navbar />
      {isLoading ? (
        <Skeleton />
      ) : (
        <Box sx={{ padding: 5, mt: { xs: "80px", sm: "90px", md: "100px" } }}>
          <Typography
            variant="h1"
            sx={{
              color: (theme) => theme.palette.darkBlue,
              marginBottom: 4,
            }}
          >
            Makeup Artist
          </Typography>
          <Box
            sx={{
              display: "grid",

              gridTemplateColumns: {
                xs: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {artists &&
              artists.map((artist, index) => (
                <Box
                  key={index}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 5,
                    padding: 2,
                  }}
                >
                  <Link
                    to={`/artists/${artist.id}/profile`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                      }}
                    >
                      <img
                        src={artist.avatar_url}
                        width={50}
                        height={50}
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography>{artist.name}</Typography>
                        <Typography
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <PlaceIcon />
                          {artist.locations[0].districtName},{" "}
                          {artist.locations[0].provinceName}
                        </Typography>
                        <Typography
                          sx={{ display: "flex", alignItems: "center" }}
                        >
                          <Rating
                            value={4}
                            precision={0.5}
                            sx={{
                              color: "black",
                            }}
                            readOnly
                            size="small"
                          />
                          4.5
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ marginTop: 1 }}>
                      <Swiper
                        modules={[Autoplay]}
                        spaceBetween={10}
                        slidesPerView={1}
                        autoplay={{
                          delay: 1000,
                          disableOnInteraction: false,
                        }}
                        style={{
                          borderRadius: 8,
                          overflow: "hidden",
                          width: 150,
                          height: 120,
                        }}
                      >
                        {artist.media_urls.map((url, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={url}
                              alt={`slide-${index}`}
                              style={{
                                width: "150px",
                                height: "120px",
                                objectFit: "cover",
                                borderRadius: 8,
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </Box>
                  </Link>
                </Box>
              ))}
          </Box>
        </Box>
      )}
      <Footer />
    </Box>
  );
}
