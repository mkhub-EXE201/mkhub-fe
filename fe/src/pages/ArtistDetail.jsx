import {
  Box,
  Button,
  Modal as MuiModal,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  Backdrop,
  Fade,
  Stepper,
  Step,
  StepLabel,
  Modal as ModalMui,
  TextField,
  Avatar,
  Divider,
} from "@mui/material";
import React, { useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import { useParams } from "react-router-dom";
import { useState } from "react";
import userApis from "../apis/users.apis";
import toast from "react-hot-toast";
import HttpStatusCode from "../constants/httpStatus";
import LinkIcon from "@mui/icons-material/Link";
import { formatCurrency } from "../utils/utils";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Footer from "../components/layout/Footer";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import locationApi from "../apis/locations.apis";
import FullCalendarComponent from "../components/FullCalendar";
import artistSchedulesApis from "../apis/artistSchedules.apis";
import artistApis from "../apis/artists.apis";
import postApis from "../apis/posts.apis";
import commentApis from "../apis/comment.apis";

const steps = ["Thông tin cơ bản", "Hình ảnh mô tả", "Xác nhận trước khi gửi"];

export default function ArtistDetail() {
  const { id } = useParams();
  const [profile, setProfile] = useState();
  const [services, setServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [value, setValue] = useState(0);
  const [currentModal, setCurrentModal] = useState(null);

  const openImageModal = () => setCurrentModal("post");
  const openConfirmModal = () => setCurrentModal("booking");
  const closeModal = () => setCurrentModal(null);

  const [activeStep, setActiveStep] = useState(0);
  const [events, setCalendarEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const getAllSchedules = async () => {
    const response = await artistSchedulesApis.getAllArtistWokingSchedule();
    if (response.status === HttpStatusCode.Ok) {
      setCalendarEvents(response.data.result);
    }
  };
  const getPhotos = async () => {
    try {
      const response = await artistApis.getArtistPhotos(id);
      if (response.status === HttpStatusCode.Ok) {
        setPhotos(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getPosts = async () => {
    try {
      const response = await artistApis.getArtistPosts(id);
      if (response.status === HttpStatusCode.Ok) {
        setPosts(response.data.result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmit = () => {};
  const handleNext = () => {};
  const handleBack = () => {};
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleImageClick = (mediaList, post) => {
    setSelectedMedia(mediaList);
    setCurrentModal("post");
    setSelectedPost(post);
    getAllComments(post.id);
  };

  const getAllComments = async (postId) => {
    try {
      const response = await postApis.getAllComments(postId);
      if (response.status === HttpStatusCode.Ok) {
        setComments(response.data.result);
      }
    } catch (error) {
      throw new Error(error);
    }
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const getArtistProfileDetail = async () => {
    try {
      const response = await userApis.getArtistDetail(id);
      if (response.status === HttpStatusCode.Ok) {
        setProfile(response.data.result);
        setServices(response.data.result.services);

        const locationsData = await Promise.all(
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

            return {
              streetName: item.street_name,
              wardName: wardName.data.result,
              districtName: districtName.data.result,
              provinceName: provinceName.data.result,
            };
          })
        );

        setLocations(locationsData);
      }
    } catch (error) {
      toast.error(error.message || error.response.data.msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async () => {
    try {
      const payload = {
        post_id: selectedPost.id,
        content: comment,
      };
      console.log(payload);
      const response = await commentApis.addComment(payload);
      if (response.status === HttpStatusCode.Ok) {
        setComment("");
        getAllComments(selectedPost.id);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  useEffect(() => {
    getArtistProfileDetail();
    getPhotos();
    getPosts();
  }, []);

  return (
    <Box sx={{ mt: 10 }}>
      <Navbar />
      <Box>
        {isLoading ? (
          <Box sx={{ padding: 10 }}>
            <Skeleton variant="text" sx={{ fontSize: "1rem", padding: 10 }} />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} />

            <Skeleton variant="rounded" width={210} height={60} />
          </Box>
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
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      marginY: 1,
                    }}
                  >
                    {locations.map((item, index) => (
                      <Box
                        key={index}
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
                        <Button
                          size="small"
                          variant="contained"
                          // onClick={() => setOpen(item.id)}
                          onClick={() => setCurrentModal("booking")}
                        >
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
                  <Tab label="Video" {...a11yProps(1)} />
                  <Tab label="Bài Đăng" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {photos.map((item, index) => (
                    <img
                      key={index}
                      src={item}
                      alt={`photo-${index}`}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  ))}
                </Box>
              </CustomTabPanel>

              <CustomTabPanel value={value} index={1}>
                Video
              </CustomTabPanel>

              <CustomTabPanel value={value} index={2}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  {posts.map((item, index) => (
                    <img
                      key={index}
                      src={item.media_url[0]}
                      alt={`photo-${index}`}
                      onClick={() => handleImageClick(item.media_url, item)}
                      style={{
                        width: 300,
                        height: 300,
                        borderRadius: 8,
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                    />
                  ))}
                </Box>
                <ModalMui
                  open={currentModal === "post"}
                  onClose={closeModal}
                  post={selectedPost}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      width: "90%",
                      maxWidth: 1000,
                      height: 500,
                      bgcolor: "background.paper",
                      boxShadow: 24,
                      outline: "none",
                      borderRadius: 2,
                      display: "flex",
                      overflow: "hidden",
                    }}
                  >
                    {/* Left: Swiper */}
                    <Box sx={{ width: "50%", height: "100%", bgcolor: "#000" }}>
                      <Swiper
                        spaceBetween={10}
                        style={{ width: "100%", height: "100%" }}
                        slidesPerView={1}
                      >
                        {selectedMedia.map((url, idx) => (
                          <SwiperSlide key={idx}>
                            <img
                              src={url}
                              alt={`slide-${idx}`}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                backgroundColor: "#000",
                              }}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </Box>

                    {/* Right: Content */}
                    <Box
                      sx={{
                        width: "50%",
                        height: "100%",
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar src={profile.avatar_url} />
                          <Typography variant="h6" gutterBottom>
                            {profile.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                          {selectedPost.content}
                        </Typography>
                        <Divider />
                      </Box>

                      <Box
                        sx={{
                          flexGrow: 1,
                          overflowY: "auto",
                          pr: 1,
                        }}
                      >
                        {comments && comments.length > 0 ? (
                          comments.map((item) => (
                            <Box
                              key={item.id}
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 1,
                                mb: 2,
                              }}
                            >
                              <Avatar
                                src={item.avatar_url}
                                sx={{ width: 36, height: 36 }}
                              />
                              <Box
                                sx={{
                                  backgroundColor: "#f0f2f5",
                                  padding: "8px 12px",
                                  borderRadius: "18px",
                                  maxWidth: "100%",
                                }}
                              >
                                <Typography
                                  sx={{ fontWeight: 500, fontSize: 14 }}
                                >
                                  {item.last_name} {item.first_name}
                                </Typography>
                                <Typography sx={{ fontSize: 14 }}>
                                  {item.content}
                                </Typography>
                              </Box>
                            </Box>
                          ))
                        ) : (
                          <Typography>Không có bình luận nào.</Typography>
                        )}
                      </Box>

                      <Box sx={{ mt: 2 }}>
                        <TextField
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleAddComment();
                            }
                          }}
                          fullWidth
                          placeholder="Comment..."
                          variant="outlined"
                          size="small"
                          InputProps={{
                            sx: {
                              borderRadius: "20px",
                              paddingY: "6px",
                              paddingX: "12px",
                            },
                          }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "20px",
                              backgroundColor: "#f9f9f9",
                              "& fieldset": {
                                borderColor: "#ccc",
                              },
                              "&:hover fieldset": {
                                borderColor: "#aaa",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: "#555",
                              },
                            },
                            "& .MuiInputBase-input::placeholder": {
                              color: "#888",
                              opacity: 1,
                            },
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </ModalMui>
              </CustomTabPanel>
            </Box>
          </Box>
        )}
        <MuiModal
          open={currentModal === "booking"}
          onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{ timeout: 500 }}
        >
          <Fade in={open}>
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 800,
                maxHeight: "90vh",
                overflowY: "auto",
                bgcolor: "background.paper",
                borderRadius: 2,
                boxShadow: 24,
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography id="modal-title" variant="h6" component="h2">
                  Thêm gói makeup mới
                </Typography>
              </Box>

              <Box sx={{ mt: 4 }}>
                <Stepper activeStep={activeStep}>
                  {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};

                    return (
                      <Step key={index} {...stepProps}>
                        <StepLabel {...labelProps}>{label}</StepLabel>
                      </Step>
                    );
                  })}
                </Stepper>

                <Box sx={{ mt: 4 }}>
                  {activeStep === 0 && (
                    <>
                      <FullCalendarComponent
                        events={events.map((schedule) => ({
                          id: schedule.id,
                          title: schedule.is_available
                            ? "Available"
                            : "Unavailable",
                          start: schedule.start_time,
                          end: schedule.end_time,
                          backgroundColor: schedule.is_available
                            ? "#28a745"
                            : "#dc3545",
                          extendedProps: {
                            artistId: schedule.artist_id,
                            dayOfWeek: schedule.day_of_week,
                          },
                        }))}
                        getAllSchedules={getAllSchedules}
                        selectedDate={selectedDate}
                      />
                    </>
                  )}
                </Box>

                {/* Nút Tiếp theo / Quay lại */}
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={
                      activeStep === steps.length ? handleSubmit : handleNext
                    }
                    sx={{ mr: 1 }}
                  >
                    {activeStep === steps.length ? "Gửi" : "Tiếp theo"}
                  </Button>
                  <Button onClick={handleBack} disabled={activeStep === 0}>
                    Quay lại
                  </Button>
                </Box>
              </Box>
            </Box>
          </Fade>
        </MuiModal>
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
