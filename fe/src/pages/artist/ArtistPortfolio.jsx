import React, { useContext, useEffect, useState } from "react";
import { Box, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import artistApis from "../../apis/artists.apis";
import { AppContext } from "../../contexts/app.context";
import toast from "react-hot-toast";
import ArtistProfile from "../../components/ArtistProfile";
import ArtistAddress from "../../components/ArtistAddress";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function ArtistPortfolio() {
  const { profile } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [portfolio, setPortfolio] = useState([]);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const getArtistPortfolio = async () => {
      try {
        const response = await artistApis.getArtistProfile(profile.artist_id);
        setPortfolio(response.data.result);
      } catch (error) {
        toast.error(error.message || error.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    getArtistPortfolio();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ margin: 4 }}>
      <Typography
        variant="h1"
        sx={{ color: (theme) => theme.palette.primary.main }}
      >
        Hồ sơ cá nhân
      </Typography>
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Skeleton variant="circular" width={100} height={100} />
            <Skeleton variant="rectangular" width={310} height={60} />
            <Skeleton variant="rounded" width={310} height={60} />
          </Box>
        ) : (
          <Box sx={{ marginY: 4 }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Thông tin cá nhân" {...a11yProps(0)} />
              <Tab label="Sổ địa chỉ" {...a11yProps(1)} />
            </Tabs>
            {value === 0 && (
              <>
                <ArtistProfile portfolio={portfolio} />
              </>
            )}
            {value === 1 && <ArtistAddress profile={profile} />}
          </Box>
        )}
      </Box>
    </Box>
  );
}
