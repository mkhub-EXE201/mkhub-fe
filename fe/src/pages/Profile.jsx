import { Box, Divider, Tab, Tabs, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useState } from "react";
import Skeleton from "../components/Skeleton";
import userApis from "../apis/users.apis";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  useEffect(() => {
    try {
      const getOwnProfile = async () => {
        const response = await userApis.getMe();
        if (response.status === HttpStatusCode.Ok) {
          setProfile(response.data.result);
          console.log(response.data.result);
        }
      };
      getOwnProfile();
    } catch (error) {
      toast.error(error.message || error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <Box>
      <Navbar />
      <Box>
        {isLoading ? (
          <Skeleton />
        ) : (
          <Box sx={{ padding: 3 }}>
            <Box
              sx={{
                padding: 3,
                margin: "0 auto",
                marginTop: 5,
                borderRadius: 5,
                // border: "1px solid black",
                width: { xs: "90%", md: "85%" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                {/* Avatar */}
                <Box
                  component="img"
                  src={profile?.avatar_url}
                  sx={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: "50%",
                    flexShrink: 0,
                  }}
                  alt="Artist Avatar"
                />

                {/* Thông tin Artist */}
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      marginBottom: 1,
                    }}
                  >
                    {profile?.last_name} {profile?.first_name}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        marginBottom: 1,
                      }}
                    >
                      {profile?.email}
                    </Typography>
                    <Divider orientation="vertical" flexItem />
                    <Typography
                      sx={{ fontSize: "16px", color: "gray", marginBottom: 1 }}
                    >
                      {profile?.phone_number}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box sx={{ marginX: 10, padding: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Lịch hẹn makeup" {...a11yProps(0)} />
                  <Tab label="Sổ địa chỉ" {...a11yProps(1)} />
                  <Tab label="Ưu đãi của tôi" {...a11yProps(2)} />
                </Tabs>
              </Box>
              {value === 0 && (
                <>
                  <Typography>Ahihi</Typography>
                </>
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
function CustomTabPanel(props) {
  // eslint-disable-next-line react/prop-types
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
