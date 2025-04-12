import CountUp from "react-countup";
import { Box, Typography, Grid } from "@mui/material";
import React from "react";
import { formatNumber } from "../utils/utils";
import Counter from "./Counter";

export default function StatCard() {
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
        <Grid item xs={12} sm={6} md={6}>
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
              <Counter targetNumber={1000} />
            </Typography>
          </Box>
        </Grid>

        {/* Makeup Artist */}
        <Grid item xs={12} sm={6} md={6}>
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
              <Counter targetNumber={400} />
            </Typography>
          </Box>
        </Grid>

        {/* lượt chốt lịch */}
        <Grid item xs={12} sm={6} md={6}>
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
              {/* <CountUp start={24950} end={25000} duration={5.0} separator="," /> */}
              <Counter targetNumber={2000} />
            </Typography>
          </Box>
        </Grid>

        {/* đánh giá */}
        <Grid item xs={12} sm={6} md={6}>
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
