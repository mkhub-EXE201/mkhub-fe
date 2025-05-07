/* eslint-disable react/prop-types */
import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useState } from "react";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function ArtistPortfolio() {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ margin: 4 }}>
      <Typography
        sx={{
          fontSize: 36,
          fontWeight: "500",
          color: (theme) => theme.palette.darkPink,
        }}
      >
        Portfolio
      </Typography>
      {/* gallery - thư viện ảnh/video post */}
      <Box sx={{ marginY: 4 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Ảnh" {...a11yProps(0)} />
            <Tab label="Video" {...a11yProps(1)} />
            <Tab label="Album" {...a11yProps(2)} />
          </Tabs>
        </Box>
        {value === 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ p: 3 }}>Ảnh của bạn</Box>
            <Typography
              sx={{
                paddingY: 1,
                paddingX: 2,
                "&:hover": {
                  cursor: "pointer",
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.lightGray,
                },
              }}
            >
              Thêm ảnh +
            </Typography>
          </Box>
        )}

        {value === 1 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ p: 3 }}>Video của bạn</Box>
            <Typography
              sx={{
                paddingY: 1,
                paddingX: 2,
                "&:hover": {
                  cursor: "pointer",
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.lightGray,
                },
              }}
            >
              Thêm video +
            </Typography>
          </Box>
        )}

        {value === 2 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ p: 3 }}>Album của bạn</Box>
            <Typography
              sx={{
                paddingY: 1,
                paddingX: 2,
                "&:hover": {
                  cursor: "pointer",
                  borderRadius: 2,
                  bgcolor: (theme) => theme.palette.lightGray,
                },
              }}
            >
              Thêm album +
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
