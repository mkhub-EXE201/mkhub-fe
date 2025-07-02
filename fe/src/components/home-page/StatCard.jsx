import CountUp from "react-countup";
import { Box, Typography, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Counter from "../Counter";
import { HttpStatusCode } from "axios";
import artistApis from "../../apis/artists.apis";
import bookingApis from "../../apis/bookings.apis";

export default function StatCard() {
  const [numOfRegister, setNumOfRegister] = useState(0);
  const [numOfArtists, setNumOfArtists] = useState(0);
  const [numOfBookings, setNumOfBookings] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllStats = async () => {
    try {
      const [artistsRes, bookingsRes, applicationsRes] = await Promise.all([
        artistApis.getAllArtists(),
        bookingApis.getTotalBookings(),
        artistApis.getTotalApplications(),
      ]);

      if (artistsRes.status === HttpStatusCode.Ok) {
        setNumOfArtists(artistsRes.data.result.length);
      }
      if (bookingsRes.status === HttpStatusCode.Ok) {
        setNumOfBookings(bookingsRes.data.result);
      }
      if (applicationsRes.status === HttpStatusCode.Ok) {
        setNumOfRegister(applicationsRes.data.result.length);
      }
    } catch (error) {
      console.error("Error loading statistics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  return (
    <Box sx={{ marginTop: 5, marginBottom: 10, marginX: 2 }}>
      <Grid
        container
        spacing={4}
        wrap="wrap"
        sx={{
          alignItems: {
            xs: "center",
          },
          justifyContent: {
            sm: "space-around",
            md: "space-around",
          },
          flexDirection: {
            xs: "column", // 1 cột khi màn hình nhỏ
            sm: "row", // 2 cột khi màn hình sm
            md: "row", // 2 cột khi màn hình md
          },
        }}
      >
        {/* lượt đăng kí */}
        <Grid gridSize={{ xs: 12, sm: 6, md: 6 }}>
          <Box>
            <Typography
              sx={{
                fontSize: {
                  md: "16px",
                  sm: "16px",
                  xs: "14px",
                },
                fontWeight: 500,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              Lượt đăng kí
            </Typography>
            <Box
              sx={{
                fontSize: {
                  xs: "24px",
                  sm: "44px",
                  md: "44px",
                },
                fontWeight: 600,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <Counter targetNumber={numOfRegister} />
            </Box>
          </Box>
        </Grid>

        {/* Makeup Artist */}
        <Grid xs={12} sm={6} md={6}>
          <Box>
            <Typography
              sx={{
                fontSize: {
                  md: "16px",
                  sm: "16px",
                  xs: "14px",
                },
                fontWeight: 500,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              Makeup Artist
            </Typography>
            <Box
              sx={{
                fontSize: {
                  xs: "24px",
                  sm: "44px",
                  md: "44px",
                },
                fontWeight: 600,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              <Counter targetNumber={numOfArtists} />
            </Box>
          </Box>
        </Grid>

        {/* lượt chốt lịch */}
        <Grid xs={12} sm={6} md={6}>
          <Box>
            <Typography
              sx={{
                fontSize: {
                  md: "16px",
                  sm: "16px",
                  xs: "14px",
                },
                fontWeight: 500,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              Lượt chốt lịch
            </Typography>
            <Box
              sx={{
                fontSize: {
                  xs: "24px",
                  sm: "44px",
                  md: "44px",
                },
                fontWeight: 600,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              {/* <CountUp start={24950} end={25000} duration={5.0} separator="," /> */}
              <Counter targetNumber={numOfBookings} />
            </Box>
          </Box>
        </Grid>

        {/* đánh giá */}
        <Grid gridSize={{ xs: 12, sm: 6, md: 6 }}>
          <Box>
            <Typography
              sx={{
                fontSize: {
                  md: "16px",
                  sm: "16px",
                  xs: "14px",
                },
                fontWeight: 500,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              Đánh giá
            </Typography>
            <Typography
              sx={{
                fontSize: {
                  xs: "24px",
                  sm: "44px",
                  md: "44px",
                },
                fontWeight: 600,
                color: (theme) => theme.palette.primary.main,
              }}
            >
              {/* 99% */}
              <CountUp start={0} end={90} duration={3.0} />
              {"%"}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
