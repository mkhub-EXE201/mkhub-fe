/* eslint-disable react/prop-types */
import { Box, Tab, Tabs, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import artistApis from "../../apis/artists.apis";
import { AppContext } from "../../contexts/app.context";
import EditIcon from "@mui/icons-material/Edit";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
export default function ArtistMedia() {
  const [value, setValue] = useState(0);
  const [artistPhotos, setArtistPhotos] = useState([]);
  const [artistVideos, setArtistVideos] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const { profile } = useContext(AppContext);
  useEffect(() => {
    const getArtistProfile = async () => {
      const response = await artistApis.getArtistPhotos(profile.id);
      if (response.status === 200) {
        console.log(response.data.result);
        setArtistPhotos(response.data.result);
      }
    };
    getArtistProfile();
  }, []);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ margin: 4 }}>
      {/* gallery - thư viện ảnh/video post */}
      <Typography
        sx={{
          fontSize: 40,
          fontWeight: "600",
          color: (theme) => theme.palette.primary.main,
        }}
      >
        Bộ sưu tập
      </Typography>
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
          <>
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
            {artistPhotos.length > 0 && (
              <Box sx={{ display: "flex", gap: 2 }}>
                {artistPhotos.map((item) => (
                  <Box sx={{ position: "relative" }} key={item}>
                    <img
                      src={item}
                      alt=""
                      width={200}
                      height={200}
                      style={{ objectFit: "cover", borderRadius: 10 }}
                    />
                    <EditIcon
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 40,
                        height: 40,
                        backgroundColor: "#00000046",
                        borderRadius: "50%",
                        padding: 1,
                        color: (theme) => theme.palette.lightGray,
                        "&:hover": {
                          cursor: "pointer",
                          color: (theme) => theme.palette.primary.main,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </>
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
          <Box>
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
            <Box>
              {artistAlbums.length > 0 ? (
                <>
                  <Typography>Loading</Typography>
                </>
              ) : (
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
                  Bạn chưa có album nào
                </Typography>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
