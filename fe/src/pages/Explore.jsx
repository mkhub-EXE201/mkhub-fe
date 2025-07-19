/* eslint-disable react/prop-types */
import {
  Box,
  Typography,
  FormControl,
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
import { HttpStatusCode } from "axios";
import toast from "react-hot-toast";
import PlaceIcon from "@mui/icons-material/PlaceOutlined";
import CategoryIcon from "@mui/icons-material/CategoryOutlined";
import Footer from "../components/layout/Footer";
import artistServiceApis from "../apis/artistServices.apis";
import categoryApis from "../apis/categories.apis";
import { useLocation, useNavigate } from "react-router-dom";
import loadingAnimation from "../assets/loading.json";
import Lottie from "react-lottie";

export default function Explore() {
  const location = useLocation();
  const passedValue = location.state?.value;
  const [selectedValue, setSelectedValue] = useState(passedValue || "all");
  const [layouts, setLayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    if (passedValue && passedValue !== "all") {
      handleFilter(passedValue);
    }
  }, [passedValue]);

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
      await getCategories();

      if (passedValue && passedValue !== "all") {
        await handleFilter(passedValue);
      } else {
        await handleGetAllServices();
      }

      setLoading(false);
    };
    fetchData();
  }, []);

  const handleFilter = async (value) => {
    const params = {};
    if (value && value !== "all") {
      params.category_id = value;
    }
    const response = await artistServiceApis.getAllServices(params);
    if (response.status === HttpStatusCode.Ok) {
      setLayouts(response.data.result);
    } else {
      toast.error("Không thể lọc layout");
    }
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
                <Accordion
                  expanded={expanded}
                  onChange={() => setExpanded(!expanded)}
                >
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
                        onClick={() =>
                          navigate(`/artists/${item.artist.id}/profile`)
                        }
                        key={item.id}
                        sx={{
                          cursor: "pointer",
                          border: "1px solid #ccc",
                          borderRadius: 2,
                          padding: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                          boxShadow: 1,
                          backgroundColor: "#fff",
                          transition: "transform 0.3s ease",
                          ":hover": {
                            transform: "scale(1.05)",
                          },
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
                              borderRadius: "10%",
                              width: 70,
                              aspectRatio: "1/1",
                              objectFit: "cover",
                            }}
                          />
                          <Box>
                            <Typography fontSize={14} fontWeight={500}>
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
