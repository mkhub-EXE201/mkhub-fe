import {
  Box,
  MenuItem,
  Typography,
  Select,
  FormControl,
  InputLabel,
  AccordionDetails,
  AccordionSummary,
  Accordion,
  Button,
  Rating,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import toast from "react-hot-toast";
import HttpStatusCode from "../constants/httpStatus";
import artistLocationApis from "../apis/artistLocations.apis";
import locationApi from "../apis/locations.apis";
import { Link } from "react-router-dom";
import artistApis from "../apis/artists.apis";
import loadingAnimation from "../assets/loading.json";
import Lottie from "react-lottie";

export default function Community() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState([]);

  useEffect(() => {
    getProvinces();
    getArtists();
  }, []);

  useEffect(() => {
    const getDistricts = async () => {
      if (!selectedProvince) return;
      const response = await locationApi.getDistricts(Number(selectedProvince));
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setDistricts(data);
        setSelectedDistrict("");
      } else {
        toast.error("Lỗi lấy danh sách quận/huyện");
      }
    };
    getDistricts();
  }, [selectedProvince]);

  const getArtists = async () => {
    try {
      const response = await artistApis.getAllArtists();
      if (response.status === HttpStatusCode.Ok) {
        setArtists(response.data.result);
      }
    } catch (error) {
      toast.error(error.message || error.response.data.msg);
    } finally {
      setLoading(false);
    }
  };

  const getProvinces = async () => {
    const response = await locationApi.getProvinces();
    if (response.status === HttpStatusCode.Ok) {
      const data = response.data.result;
      setProvinces(data);
    } else {
      toast.error("Lỗi lấy danh sách tỉnh/thành phố");
    }
  };

  const handleSearchLocation = async () => {
    const response = await artistLocationApis.findNearArtists(
      selectedProvince,
      selectedDistrict
    );
    if (response.status === HttpStatusCode.Ok) {
      setArtists(response.data.result);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ định vị");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords({ lat: latitude, lng: longitude });
        toast.success(`Đã lấy được vị trí!, ${latitude} ${longitude}`);
      },
      () => {
        toast.error("Không thể lấy vị trí của bạn");
      }
    );
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, marginTop: 5, marginX: 5 }}>
        {loading ? (
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: loadingAnimation,
              rendererSettings: {
                preserveAspectRatio: "xMidYMid slice",
              },
            }}
            height={500}
            width={500}
          />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "30%",
                position: "sticky",
                top: 0, // độ cao cố định để sticky
                alignSelf: "flex-start",
                height: "fit-content",
                boxShadow: 2,
                backgroundColor: "#fff",
                zIndex: 1,
              }}
            >
              <Accordion>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2-content"
                  id="panel2-header"
                >
                  <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                    <PlaceIcon />
                    <Typography
                      component="span"
                      sx={{ fontWeight: "600", fontSize: 14 }}
                    >
                      Địa điểm
                    </Typography>
                  </Box>
                </AccordionSummary>
                <Typography
                  sx={{
                    paddingX: 3,
                    paddingBottom: 2,
                    color: (theme) => theme.palette.darkBrown,
                  }}
                >
                  Chọn khu vực để hiển thị kết quả phù hợp gần bạn.
                </Typography>
                {/* tỉnh/thành phố */}
                <AccordionDetails>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Tỉnh/Thành phố
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      value={selectedProvince ?? ""}
                      label="Tỉnh/Thành phố"
                      onChange={(e) =>
                        setSelectedProvince(Number(e.target.value))
                      }
                    >
                      {provinces &&
                        provinces.length > 0 &&
                        provinces.map((province) => (
                          <MenuItem
                            key={province.ProvinceID}
                            value={province.ProvinceID.toString()}
                          >
                            {province.ProvinceName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </AccordionDetails>
                {/* quận/huyện */}
                <AccordionDetails>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Quận/Huyện
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      value={selectedDistrict ?? ""}
                      label="Quận/Huyện"
                      onChange={(e) =>
                        setSelectedDistrict(Number(e.target.value))
                      }
                    >
                      {districts &&
                        districts.length > 0 &&
                        districts.map((district) => (
                          <MenuItem
                            key={district.DistrictID}
                            value={district.DistrictID.toString()}
                          >
                            {district.DistrictName}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    fullWidth
                    onClick={handleSearchLocation}
                  >
                    Tìm kiếm
                  </Button>
                  <Typography
                    sx={{
                      textAlign: "center",
                      marginX: 2,
                      marginY: 1,
                      color: (theme) => theme.palette.darkBrown,
                    }}
                  >
                    Hoặc
                  </Typography>
                  <Box sx={{ padding: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <button
                        onClick={handleGetLocation}
                        style={{
                          backgroundColor: "#ED1E79",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "8px 12px",
                          cursor: "pointer",
                          fontWeight: 500,
                        }}
                      >
                        Lấy tọa độ của tôi
                      </button>
                      {userCoords && (
                        <Typography sx={{ fontSize: 14 }}>
                          Vĩ độ: <b>{userCoords.lat.toFixed(5)}</b> <br />
                          Kinh độ: <b>{userCoords.lng.toFixed(5)}</b>
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>
            <Box
              sx={{ boxShadow: 2, width: "70%", height: "100%", padding: 3 }}
            >
              {artists.length > 0 ? (
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: 3,
                  }}
                >
                  {/* {artists.map((item) => {
                const artist = item.artist;
                return (
                  <Box
                    key={item.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      border: "1px solid #ccc",
                      borderRadius: 2,
                      padding: 2,
                      backgroundColor: "#fff",
                      boxShadow: 1,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <img
                        src={artist.avatar_url}
                        alt={artist.name}
                        style={{
                          width: 70,
                          height: 70,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <Box>
                        <Typography fontWeight={600}>{artist.name}</Typography>
                        <Typography fontSize={13} color="text.secondary">
                          {item.street_name}
                        </Typography>
                      </Box>
                    </Box>

                    {artist.Service && artist.Service.length > 0 && (
                      <Box sx={{ mt: 2 }}>
                        <Typography
                          fontWeight={500}
                          sx={{ mb: 1, fontSize: 14 }}
                          color="primary"
                        >
                          Dịch vụ:
                        </Typography>
                        {artist.Service.map((service) => (
                          <Box
                            key={service.id}
                            sx={{
                              border: "1px solid #ddd",
                              borderRadius: 1,
                              padding: 1,
                              mb: 1,
                            }}
                          >
                            <Typography fontWeight={500} fontSize={13}>
                              {service.service_name}
                            </Typography>
                            <Typography fontSize={12} color="text.secondary">
                              {service.min_price.toLocaleString()}₫ –{" "}
                              {service.max_price.toLocaleString()}₫
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                );
              })} */}
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
                              style={{
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
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
              ) : (
                <Typography textAlign="center" sx={{ mt: 2 }}>
                  Không có nghệ sĩ nào gần bạn.
                </Typography>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}
