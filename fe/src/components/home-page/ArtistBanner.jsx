import React from "react";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { Box, Chip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import ArtistCarousel from "../ArtistCarousel";
import path from "../../constants/path";

export default function ArtistBanner() {
  return (
    <Box
      sx={{
        marginX: { xs: 2, sm: 6, md: 12, lg: 10 },
        marginY: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <Typography
          sx={{
            fontWeight: "600",
            fontSize: {
              xs: "24px",
              sm: "44px",
              md: "44px",
            },
            color: (theme) => theme.palette.darkBlue,
          }}
        >
          Makeup Artist trên MKub
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
                to={path.community}
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

      <ArtistCarousel />
    </Box>
  );
}
