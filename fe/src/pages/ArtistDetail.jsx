import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import { useState } from "react";
import userApis from "../apis/users.apis";
import toast from "react-hot-toast";
import HttpStatusCode from "../constants/httpStatus";
import Skeleton from "../components/Skeleton";
import LinkIcon from "@mui/icons-material/Link";
import { formatCurrency } from "../utils/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../components/Footer";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import locationApi from "../apis/locations.apis";

export default function ArtistDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
    const getArtistProfileDetail = async () => {
      try {
        const response = await userApis.getArtistDetail(id);
        if (response.status === HttpStatusCode.Ok) {
          setProfile(response.data.result);
          setServices(response.data.result.services);

          response.data.result.locations.map(async (item) => {
            const wardName = await locationApi.getWardNameByCode(
              item.ward_code,
              item.district_id
            );
            const districtName = await locationApi.getDistrictNameByCode(
              item.district_id,
              item.province_id
            );
            const provinceName = await locationApi.getProvinceNameByCode(
              item.province_id
            );
            setLocations((prev) => [
              ...prev,
              {
                streetName: item.street_name,
                wardName: districtName.data.result,
                districtName: districtName.data.result,
                provinceName: provinceName.data.result,
              },
            ]);
          });
        }
      } catch (error) {
        toast.error(error.message || error.response.data.msg);
      } finally {
        setIsLoading(false);
      }
    };
    getArtistProfileDetail();
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
                border: "1px solid black",
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
                  src={profile.avatar_url}
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
                    {profile.name}
                  </Typography>

                  <Typography
                    sx={{ fontSize: "16px", color: "gray", marginBottom: 1 }}
                  >
                    About me
                  </Typography>

                  <Typography sx={{ fontSize: "16px", marginBottom: 2 }}>
                    {profile.bio}
                  </Typography>
                  {/* Address */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {locations.map((item) => (
                      <Box
                        key={item}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LocationPinIcon />
                        <Typography
                          sx={{
                            fontSize: "14px",
                            wordBreak: "break-word",
                          }}
                        >
                          {item.streetName}
                          {", "}
                          {item.wardName}
                          {", "}
                          {item.districtName}
                          {", "} {item.provinceName}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  {/* Portfolio link */}
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {profile.portfolio_url.map((item) => (
                      <Box
                        key={item}
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <LinkIcon fontSize="small" />
                        <Typography
                          sx={{
                            fontSize: "14px",
                            color: (theme) => theme.palette.primary.main,
                            wordBreak: "break-word",
                            "& a": {
                              color: "text.primary",
                              textDecoration: "none",
                              transition: "all 0.2s",
                            },
                            "& a:hover": {
                              color: "primary.main",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          <a
                            href={item}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item}
                          </a>
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Nút Liên hệ ngay */}
                <Box
                  sx={{
                    bgcolor: (theme) => theme.palette.darkBlue,
                    color: "white",
                    paddingX: 3,
                    paddingY: 1.5,
                    borderRadius: 5,
                    fontWeight: "bold",
                    cursor: "pointer",
                    alignSelf: "center",
                    whiteSpace: "nowrap",
                    "&:hover": {
                      opacity: 0.9,
                    },
                  }}
                >
                  Liên hệ ngay
                </Box>
              </Box>
            </Box>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: "600",
                marginTop: 5,
                marginX: 10,
                padding: 2,
              }}
            >
              Dịch vụ
            </Typography>
            <Box
              sx={{
                marginX: { xs: 2, sm: 6, md: 12, lg: 10 },
              }}
            >
              <Swiper
                slidesPerView={"auto"}
                spaceBetween={20}
                grabCursor={true}
                style={{ paddingBottom: 20 }}
              >
                {services.map((item, index) => (
                  <SwiperSlide
                    key={index}
                    style={{
                      width: "250px",
                      height: "350px",
                      borderRadius: "15px",
                      overflow: "hidden",
                      transition: "all 0.4s ease",
                      transform:
                        hoveredIndex === index
                          ? "scale(1.05)"
                          : hoveredIndex === null
                            ? "scale(1)"
                            : "scale(0.9)",
                      opacity:
                        hoveredIndex === null || hoveredIndex === index
                          ? 1
                          : 0.5,
                      boxShadow:
                        hoveredIndex === index
                          ? "0 8px 20px rgba(0,0,0,0.25)"
                          : "none",
                      zIndex: hoveredIndex === index ? 10 : 1,
                      cursor: "pointer",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Card
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderRadius: "15px",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="150"
                        image={profile.avatar_url}
                        alt={item.service_name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: 600, mb: 1 }}
                        >
                          {item.service_name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            fontSize: 13,
                          }}
                        >
                          {item.description}
                        </Typography>
                        <Typography
                          sx={{ mt: 2, fontWeight: "600", fontSize: 14 }}
                        >
                          Từ {formatCurrency(item.min_price)} -{" "}
                          {formatCurrency(item.max_price)} VND
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{ justifyContent: "space-between", px: 2, pb: 2 }}
                      >
                        <Button size="small" variant="outlined">
                          Liên hệ
                        </Button>
                        <Button size="small" variant="contained">
                          Đặt lịch
                        </Button>
                      </CardActions>
                    </Card>
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
            <Typography
              sx={{
                fontSize: 30,
                fontWeight: "600",
                marginTop: 5,
                marginX: 10,
                padding: 2,
              }}
            >
              Portfolio
            </Typography>
            <Box sx={{ marginX: 10, padding: 2 }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Hình ảnh" {...a11yProps(0)} />
                  <Tab label="Video" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                Hình ảnh
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                Video
              </CustomTabPanel>
            </Box>
          </Box>
        )}
      </Box>
      <Footer />
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
