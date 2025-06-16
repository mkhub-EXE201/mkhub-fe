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
  Radio,
  FormControlLabel,
  FormLabel,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import locationApi from "../apis/locations.apis";
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import Footer from "../components/layout/Footer";
import artistServiceApis from "../apis/artistServices.apis";
import Skeleton from "../components/Skeleton";
import categoryApis from "../apis/categories.apis";

export default function Explore() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedValue, setSelectedValue] = useState("all");
  const [userCoords, setUserCoords] = useState(null);
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const getProvinces = async () => {
    const response = await locationApi.getProvinces();
    if (response.status === HttpStatusCode.Ok) {
      const data = response.data.result;
      setProvinces(data);
    } else {
      toast.error("Lỗi lấy danh sách tỉnh/thành phố");
    }
  };
  const getCategories = async () => {
    const response = await categoryApis.getAllCategories();
    if (response.status === HttpStatusCode.Ok) {
      const data = response.data.result;
      setCategories(data);
    } else {
      toast.error("Lỗi lấy danh sách chủ đề makeup");
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        getProvinces(),
        handleGetAllServices(),
        getCategories(),
      ]);
      setLoading(false);
    };
    fetchData();
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

  const handleFilter = async (value) => {
    const params = {};
    if (value && value !== "all") {
      params.category_id = value;
      console.log(params);
    }
    const response = await artistServiceApis.getAllServices(params);
    if (response.status === HttpStatusCode.Ok) {
      setLayouts(response.data.result);
    } else {
      toast.error("Không thể lọc layout");
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

  const handleGetAllServices = async () => {
    const response = await artistServiceApis.getAllServices();
    if (response.status === HttpStatusCode.Ok) {
      setLayouts(response.data.result);
    }
  };

  return (
    <Box>
      {loading ? (
        <Skeleton />
      ) : layouts.length > 0 ? (
        <>
          <Box sx={{ display: "flex", gap: 2, marginTop: 5, marginX: 5 }}>
            {/* left - filter*/}
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
              <Box>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                  >
                    <Box sx={{ display: "flex", flexDirection: "row", gap: 1 }}>
                      <CategoryIcon />
                      <Typography
                        component="span"
                        sx={{ fontWeight: "600", fontSize: 14 }}
                      >
                        Layout makeup
                      </Typography>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="makeup-layout-label"
                        value={selectedValue ?? ""}
                        onChange={(e) => {
                          setSelectedValue(e.target.value);
                          handleFilter(e.target.value);
                        }}
                        name="radio-buttons-group"
                      >
                        {/* Tất cả */}
                        <FormControlLabel
                          value="all"
                          control={<Radio />}
                          label="Tất cả"
                        />
                        <Box sx={{ height: 12 }} />
                        {/* Label nhóm bên dưới */}
                        <FormLabel
                          id="makeup-layout-label"
                          sx={{
                            textTransform: "uppercase",
                            fontSize: 13,
                            fontWeight: "600",
                            marginBottom: 1,
                          }}
                        >
                          Phổ biến
                        </FormLabel>
                        {categories &&
                          categories.length > 0 &&
                          categories.map((type) => (
                            <FormControlLabel
                              key={type.id}
                              value={type.id}
                              control={<Radio />}
                              label={type.name}
                            />
                          ))}
                      </RadioGroup>
                    </FormControl>
                  </AccordionDetails>
                </Accordion>

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
            </Box>

            {/* right - layout */}
            <Box
              sx={{
                boxShadow: 2,
                width: "70%",
                height: "100%",
                padding: 3,
              }}
            >
              <Typography sx={{ fontWeight: "600", fontSize: 16 }}>
                Layout dành cho bạn
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 3,
                  marginTop: 2,
                }}
              >
                {layouts.length > 0 && (
                  <>
                    {layouts.map((item, index) => (
                      <Box
                        key={item.id}
                        sx={{
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          padding: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          boxShadow: 1,
                          backgroundColor: "#fff",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                          }}
                        >
                          <img
                            src={item.thumbnail}
                            alt={`Artist ${index + 1}`}
                            style={{
                              borderRadius: "50%",
                              width: 70,
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <Box>
                            <Typography fontWeight={500}>
                              Artist {item.artist.name}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: "5px",
                              }}
                            >
                              <PlaceIcon sx={{ fontSize: 16 }} />
                              <Typography sx={{ fontSize: 13 }}>
                                {item.districtName}, {item.provinceName}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: 14 }}>
                          {item.service_name}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
              </Box>
            </Box>
          </Box>
          <Footer />
        </>
      ) : (
        <Box>
          <Typography>Hiện không có layout nào.</Typography>
        </Box>
      )}
    </Box>
  );
}
