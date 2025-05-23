import {
  Box,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from "@mui/material";

import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import Card from "@mui/material/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router-dom";

export default function TopServices() {
  return (
    <Box
      sx={{
        marginX: { xs: 2, sm: 6, md: 12, lg: 10 },
        marginY: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
          gap: 2,
        }}
      >
        <Typography
          sx={{
            color: (theme) => theme.palette.darkBlue,
            fontSize: {
              xs: "24px",
              sm: "44px",
              md: "44px",
            },
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Dịch vụ nổi bật
        </Typography>
        <Chip
          variant="outlined"
          label={
            <Box
              gap={0.5}
              sx={{
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                  md: "20px",
                },
              }}
            >
              <Link
                to={"/"}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  gap: "10px",
                  alignItems: "center",
                }}
              >
                <span>Xem thêm</span>
                <ArrowRightAltIcon fontSize="small" />
              </Link>
            </Box>
          }
          sx={{
            cursor: "pointer",
            borderColor: (theme) => theme.palette.primary.primary,
            color: (theme) => theme.palette.primary.primary,
            "&:hover": {
              backgroundColor: (theme) => theme.palette.action.hover,
            },
          }}
        />
      </Box>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          margin: "0 auto",
          paddingY: { xs: 2, sm: 3 },
        }}
      >
        <Swiper
          spaceBetween={16}
          slidesPerView={4}
          breakpoints={{
            0: { slidesPerView: 1 },
            600: { slidesPerView: 2 },
            900: { slidesPerView: 4 },
          }}
        >
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <SwiperSlide key={index}>
                <Link
                  to={"/"}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card sx={{ width: "100%", boxShadow: "none" }}>
                    <CardActionArea
                      sx={{
                        backgroundColor: (theme) => theme.palette.lightGray,
                        borderRadius: "30px",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="250px"
                        width="250px"
                        sx={{
                          borderRadius: "30px",
                          objectFit: "cover",
                        }}
                        image="/src/assets/artist-baner6.png"
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Typography
                          gutterBottom
                          sx={{
                            fontSize: {
                              xs: 12,
                              sm: 20,
                              md: 20,
                            },
                          }}
                          fontWeight={600}
                        >
                          Makeup kỉ yếu
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Link>
              </SwiperSlide>
            ))}
        </Swiper>
      </Box>
    </Box>
  );
}
