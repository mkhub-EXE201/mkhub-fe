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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import React, { useContext, useEffect } from "react";
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
import artistApis from "../apis/artists.apis";
import postApis from "../apis/posts.apis";
import { BOOKING_ADDRESS_TYPE } from "../constants/enum";
import { AppContext } from "../contexts/app.context";
import BookingCalendar from "../components/BookingCalendar";
import { Controller, useForm } from "react-hook-form";
import artistAddressSchema from "../schemas/addNewBookingSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import artistLocationApis from "../apis/artistLocations.apis";
import PostModal from "../components/PostModal";
import { ADDRESS_MESSAGE } from "../constants/message";
import bookingApis from "../apis/bookings.apis";

const steps = [
  "Chọn lịch trình",
  "Thông tin bổ sung",
  "Xác nhận trước khi gửi",
];

export default function ArtistDetail() {
  const { id } = useParams();
  const { profile: userProfileFromContext } = useContext(AppContext);

  const [profile, setProfile] = useState();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [currentModal, setCurrentModal] = useState(null);

  const closeModal = () => {
    setCurrentModal(null);
    reset();
  };

  const [activeStep, setActiveStep] = useState(0);

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [reactions, setReactions] = useState([]);
  const [myReaction, setMyReaction] = useState(null);

  // state các step booking
  const [bookingSchedule, setBookingSchedule] = useState(null);
  const [bookingStartTime, setBookingStartTime] = useState(null);
  const [bookingEndTime, setBookingEndTime] = useState(null);
  const [artistAddresses, setArtistAddresses] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [wardName, setWardName] = useState(null);
  const [districtName, setDistrictName] = useState(null);
  const [provinceName, setProvinceName] = useState(null);

  const {
    register,
    setError,
    handleSubmit,
    trigger,
    getValues,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(artistAddressSchema),
    defaultValues: {
      bookingSchedule: null,
      bookingStartTime: null,
      bookingEndTime: null,
      address_type: "",
      street_name: null,
      ward_code: null,
      district_id: null,
      province_id: null,
      address_id: "",
      artist_phone: null,
      artist_id: id,
      client_id: userProfileFromContext.id,
      client_phone: userProfileFromContext.phone_number,
      client_note: null,
      group_size: 1,
      service_id: null,
      total_price: null,
    },
  });
  // Lắng nghe thay đổi province_id từ React Hook Form
  const addressType = watch("address_type");
  const selectedProvince = watch("province_id");
  const selectedDistrict = watch("district_id");

  useEffect(() => {
    if (addressType === BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS) {
      // reset address về "" để switch từ artist address -> client address
      setValue("address", "");
    }
  }, [addressType, setValue]);

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
  const getAllReactions = async (postId) => {
    try {
      const response = await postApis.getAllReactions(postId);
      if (response.status === HttpStatusCode.Ok) {
        setReactions(response.data.result);
        response.data.result.map((item) => {
          if (item.user_id === userProfileFromContext.id) {
            setMyReaction(item);
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      console.log(getValues("ward_code"));
      const response = await bookingApis.addBookingRequest({
        client_id: watch("client_id"),
        client_phone: watch("client_phone"),
        artist_id: watch("artist_id"),
        artist_phone: watch("artist_phone"),
        service_id: watch("service_id"),
        address_type: watch("address_type"),
        province_id: Number(watch("province_id")),
        district_id: Number(watch("district_id")),
        ward_code: Number(watch("ward_code")),
        street_name: watch("street_name"),
        client_note: watch("client_note"),
        address_id: watch("address_id"),
        group_size: watch("group_size"),
        total_price: watch("total_price"),
        booking_date: new Date(watch("bookingSchedule").start)
          .toISOString()
          .split("T")[0],
        start_time: `${watch("bookingSchedule")?.start.toISOString().split("T")[0]}T${watch("bookingStartTime")}:00`,
        end_time: `${watch("bookingSchedule")?.start.toISOString().split("T")[0]}T${watch("bookingEndTime")}:00`,
      });

      if (response?.status === HttpStatusCode.Ok) {
        toast.success("Đặt lịch thành công!");
      } else {
        toast.error("Đặt lịch thất bại!");
      }
    } catch (error) {
      console.error("Lỗi đặt lịch:", error);
    }
  };

  const handleNext = async () => {
    let stepFields = [];
    if (activeStep === 0) {
      stepFields = ["bookingSchedule", "bookingStartTime", "bookingEndTime"];
    } else if (activeStep === 1) {
      setValue("artist_phone", profile.phone_number);
      setValue("artist_id", profile.id);
      setValue("service_id", selectedService.id);
      setValue("total_price", selectedService.max_price);
      if (watch("address_id")) {
        artistAddresses.map((item) => {
          if (item.id === watch("address_id")) {
            setValue("street_name", item.street_name);
            setValue("ward_code", Number(item.ward_code));
            setValue("district_id", Number(item.district_id));
            setValue("province_id", Number(item.province_id));
            setWardName(item.ward_name);
            setDistrictName(item.district_name);
            setProvinceName(item.province_name);
          }
        });
      }

      stepFields = [
        "artist_id",
        "artist_phone",
        "client_id",
        "client_phone",
        "address_type",
        "address_id",
        "client_note",
        "street_name",
        "ward_code",
        "district_id",
        "province_id",
        "service_id",
        "group_size",
        "total_price",
      ];
    }
    if (stepFields.length > 0) {
      const isStepValid = await trigger(stepFields);
      if (!isStepValid) return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleImageClick = (mediaList, post) => {
    setSelectedMedia(mediaList);
    setCurrentModal("post");
    setSelectedPost(post);
    getAllComments(post.id);
    getAllReactions(post.id);
  };

  const getAllComments = async (postId) => {
    const response = await postApis.getAllComments(postId);
    if (response.status === HttpStatusCode.Ok) {
      setComments(response.data.result);
    }
  };

  const getWardNameByCode = async (wardCode, district_id) => {
    return await locationApi.getWardNameByCode(wardCode, district_id);
  };

  const getDistrictNameByCode = async (districtId, province_id) => {
    return await locationApi.getDistrictNameByCode(districtId, province_id);
  };

  const getProvinceNameByCode = async (provinceId) => {
    return await locationApi.getProvinceNameByCode(provinceId);
  };

  const getArtistAddresses = async () => {
    const response = await artistLocationApis.getArtistWorkingLocations(id);
    if (response.status === HttpStatusCode.Ok) {
      const locations = await Promise.all(
        response.data.result.map(async (location) => {
          const ward = await getWardNameByCode(
            location.ward_code,
            location.district_id
          );
          const district = await getDistrictNameByCode(
            location.district_id,
            location.province_id
          );
          const province = await getProvinceNameByCode(location.province_id);
          return {
            ...location,
            ward_name: ward.data.result,
            district_name: district.data.result,
            province_name: province.data.result,
          };
        })
      );
      setArtistAddresses(locations);
    }
  };
  useEffect(() => {
    const getProvinces = async () => {
      const response = await locationApi.getProvinces();
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setProvinces(data);
        setValue("district_id", undefined);
        setValue("ward_code", undefined);
        setWards([]);
      } else {
        toast.error(ADDRESS_MESSAGE.CANNOT_GET_LIST_OF_PROVINCES);
      }
    };
    getProvinces();
  }, []);

  useEffect(() => {
    const getDistricts = async () => {
      if (!selectedProvince) return;

      const response = await locationApi.getDistricts(Number(selectedProvince));
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setDistricts(data);
        setValue("district_id", undefined);
        setValue("ward_code", undefined);
        setWards([]);
      } else {
        toast.error(ADDRESS_MESSAGE.CANNOT_GET_LIST_OF_DISTRICTS);
      }
    };
    getDistricts();
  }, [selectedProvince]);

  useEffect(() => {
    const getWards = async () => {
      if (!selectedDistrict) return;
      const response = await locationApi.getWards(Number(selectedDistrict));
      if (response.status === HttpStatusCode.Ok) {
        const data = response.data.result;
        setWards(data);
        setValue("ward_code", undefined);
      } else {
        toast.error(ADDRESS_MESSAGE.CANNOT_GET_LIST_OF_WARDS);
      }
    };
    getWards();
  }, [selectedDistrict]);

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

  useEffect(() => {
    getArtistProfileDetail();
    getPhotos();
    getPosts();
    getArtistAddresses();
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
                        image={item.thumbnail}
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
                          sx={{ mt: 1, fontWeight: "600", fontSize: 14 }}
                        >
                          Từ {formatCurrency(item.min_price)} -{" "}
                          {formatCurrency(item.max_price)} VND
                        </Typography>
                      </CardContent>
                      <CardActions
                        sx={{
                          justifyContent: "space-between",
                          px: 2,
                          pb: 2,
                        }}
                      >
                        <Button size="small" variant="outlined">
                          Liên hệ
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          // onClick={() => setOpen(item.id)}
                          onClick={() => {
                            setCurrentModal("booking");
                            setSelectedService(item);
                          }}
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
                  value={tabValue}
                  onChange={handleChangeTab}
                  aria-label="basic tabs example"
                >
                  <Tab label="Hình ảnh" {...a11yProps(0)} />
                  <Tab label="Video" {...a11yProps(1)} />
                  <Tab label="Bài Đăng" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={tabValue} index={0}>
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

              <CustomTabPanel value={tabValue} index={1}>
                Video
              </CustomTabPanel>

              <CustomTabPanel value={tabValue} index={2}>
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
                <PostModal
                  selectedPost={selectedPost}
                  getAllComments={getAllComments}
                  currentModal={currentModal}
                  closeModal={closeModal}
                  selectedMedia={selectedMedia}
                  profile={profile}
                  myReaction={myReaction}
                  setMyReaction={setMyReaction}
                  reactions={reactions}
                  comments={comments}
                />
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
          <Fade in={currentModal === "booking"}>
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
                  {/* Đặt lịch hẹn {selectedService.service_name} */}
                  Đặt lịch hẹn
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
                      <BookingCalendar
                        register={register}
                        watch={watch}
                        setError={setError}
                        setValue={setValue}
                        errors={errors}
                        trigger={trigger}
                        service={selectedService}
                        bookingSchedule={bookingSchedule}
                        setBookingSchedule={setBookingSchedule}
                        bookingStartTime={bookingStartTime}
                        bookingEndTime={bookingEndTime}
                        setBookingStartTime={setBookingStartTime}
                        setBookingEndTime={setBookingEndTime}
                      />

                      {bookingEndTime && (
                        <>
                          <Typography>
                            Thời gian bắt đầu: {bookingStartTime}{" "}
                            {bookingSchedule.start.toLocaleDateString("vi-VN")}
                          </Typography>
                          <Typography>
                            Dự kiến kết thúc: {bookingEndTime}{" "}
                            {bookingSchedule.end.toLocaleDateString("vi-VN")}
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                  {activeStep === 1 && (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        padding: 2,
                      }}
                    >
                      <TextField
                        fullWidth
                        label={"Tên gói makeup"}
                        value={selectedService.service_name}
                        disabled
                      />
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          label={"Tên Artist"}
                          value={profile.name}
                          disabled
                        />
                        <TextField
                          fullWidth
                          label={"Số điện thoại Artist"}
                          value={profile.phone_number}
                          disabled
                        />
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          gap: 2,
                          alignItems: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          label={"Tên người đặt"}
                          value={`${userProfileFromContext.last_name} ${userProfileFromContext.first_name}`}
                          disabled
                        />
                        <TextField
                          fullWidth
                          label={"Số điện thoại người đặt"}
                          placeholder="Số điện thoại người đặt"
                          value={`${userProfileFromContext.phone_number}`}
                          disabled
                        />
                      </Box>
                      <FormControl fullWidth>
                        <InputLabel id="address-type-label">
                          Loại địa chỉ đặt hẹn
                        </InputLabel>
                        <Select
                          labelId="address-type-label"
                          id="address-type"
                          label="Loại địa chỉ đặt hẹn"
                          value={watch("address_type")}
                          {...register("address_type")}
                        >
                          <MenuItem value={BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS}>
                            Địa chỉ của artist
                          </MenuItem>
                          <MenuItem value={BOOKING_ADDRESS_TYPE.CLIENT_ADDRESS}>
                            Địa chỉ của khách hàng
                          </MenuItem>
                        </Select>
                      </FormControl>
                      {watch("address_type") ===
                      BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS ? (
                        <FormControl fullWidth>
                          <InputLabel id="artist-address-label">
                            Chọn địa chỉ artist
                          </InputLabel>
                          <Select
                            labelId="artist-address-label"
                            {...register("address_id")}
                          >
                            {artistAddresses.map((item) => (
                              <MenuItem key={item} value={item.id}>
                                {item.street_name}
                                {", "}
                                {item.ward_name}
                                {", "}
                                {item.district_name}
                                {", "}
                                {item.province_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <>
                          {/* client address: province & district & ward */}
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              width: "100%",
                              gap: 2,
                            }}
                          >
                            {/* Province */}
                            <Controller
                              name="province_id"
                              control={control}
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={!!errors.province_id}
                                >
                                  <InputLabel id="province-label">
                                    Tỉnh/Thành phố
                                  </InputLabel>
                                  <Select
                                    labelId="province-label"
                                    id="province"
                                    label="Tỉnh/Thành phố"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  >
                                    <MenuItem value="">
                                      <em>Chọn Tỉnh/Thành phố</em>
                                    </MenuItem>
                                    {provinces?.map((p) => (
                                      <MenuItem
                                        key={p.ProvinceID}
                                        value={p.ProvinceID}
                                      >
                                        {p.ProvinceName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>
                                    {errors.province_id?.message}
                                  </FormHelperText>
                                </FormControl>
                              )}
                            />

                            {/* District */}
                            <Controller
                              name="district_id"
                              control={control}
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={!!errors.district_id}
                                >
                                  <InputLabel id="district-label">
                                    Quận/Huyện
                                  </InputLabel>
                                  <Select
                                    labelId="district-label"
                                    id="district"
                                    label="Quận/Huyện"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                  >
                                    <MenuItem value="">
                                      <em>Chọn Quận/Huyện</em>
                                    </MenuItem>
                                    {districts.map((d) => (
                                      <MenuItem
                                        key={d.DistrictID}
                                        value={d.DistrictID}
                                      >
                                        {d.DistrictName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>
                                    {errors.district_id?.message}
                                  </FormHelperText>
                                </FormControl>
                              )}
                            />

                            {/* Ward */}
                            <Controller
                              name="ward_code"
                              control={control}
                              render={({ field }) => (
                                <FormControl
                                  fullWidth
                                  error={!!errors.ward_code}
                                >
                                  <InputLabel id="ward-label">
                                    Phường/Xã
                                  </InputLabel>
                                  <Select
                                    labelId="ward-label"
                                    id="ward"
                                    label="Phường/Xã"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                  >
                                    <MenuItem value="">
                                      <em>Chọn Phường/Xã</em>
                                    </MenuItem>
                                    {wards.map((w) => (
                                      <MenuItem
                                        key={w.WardCode}
                                        value={w.WardCode}
                                      >
                                        {w.WardName}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                  <FormHelperText>
                                    {errors.ward_code?.message}
                                  </FormHelperText>
                                </FormControl>
                              )}
                            />
                          </Box>
                          {/* client address: street name */}

                          <TextField
                            label="Số & Tên đường"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            {...register("street_name")}
                            error={!!errors.street_name}
                            helperText={errors.street_name?.message || " "}
                          />
                        </>
                      )}

                      <TextField
                        fullWidth
                        label="Ghi chú của khách hàng dành cho artist (nếu có)"
                        placeholder="Da mình treatment có bong tróc"
                        {...register("client_note")}
                        error={!!errors.client_note}
                        helperText={errors.client_note?.message || " "}
                      />

                      <TextField
                        fullWidth
                        label="Tổng chi phí makeup"
                        sx={{ cursor: "not-allowed" }}
                        value={`${formatCurrency(selectedService.max_price)} VNĐ`}
                      />
                      <Controller
                        name="group_size"
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            type="number"
                            label="Số lượng khách"
                            fullWidth
                            inputProps={{
                              min: 1,
                              max: selectedService?.group_size ?? 1,
                            }}
                            error={!!errors.group_size}
                            helperText={errors.group_size?.message}
                          />
                        )}
                      />
                    </Box>
                  )}
                  {activeStep === 2 && (
                    <Box>
                      <Typography variant="h5" gutterBottom>
                        Thông tin buổi Makeup
                      </Typography>
                      <Box
                        sx={{
                          mt: 2,
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Ngày đặt hẹn"
                            value={bookingSchedule.start.toLocaleDateString(
                              "vi-VN"
                            )}
                          />

                          <TextField
                            fullWidth
                            label="Giờ bắt đầu:"
                            value={watch("bookingStartTime")}
                          />
                          <TextField
                            fullWidth
                            label="Giờ kết thúc dự kiến"
                            value={watch("bookingEndTime")}
                          />
                        </Box>
                        <TextField
                          fullWidth
                          label="Ghi chú của khách hàng"
                          value={watch("client_note") || "Không có"}
                        />
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Số lượng người đặt makeup"
                            value={watch("group_size")}
                          />
                          <TextField
                            fullWidth
                            label="Tổng chi phí"
                            value={`${formatCurrency(watch("total_price"))} VNĐ`}
                          />
                        </Box>
                        <TextField
                          fullWidth
                          label="Đặt lịch hẹn makeup tại"
                          value={
                            watch("address_type") ===
                            BOOKING_ADDRESS_TYPE.ARTIST_ADDRESS
                              ? "Studio của Artist"
                              : "Địa chỉ của khách hàng"
                          }
                        />
                        <TextField
                          fullWidth
                          label="Địa chỉ cụ thể"
                          value={`${watch("street_name")}, ${wardName}, ${districtName}, ${provinceName}`}
                        />
                        <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
                          Thông tin người đặt & Artist
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Tên Arist"
                            value={profile.name}
                          />
                          <TextField
                            fullWidth
                            label="Số điện thoại Artist"
                            value={watch("artist_phone")}
                          />
                        </Box>
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            gap: 2,
                          }}
                        >
                          <TextField
                            fullWidth
                            label="Tên Khách hàng"
                            value={`${userProfileFromContext.last_name} ${userProfileFromContext.first_name}`}
                          />
                          <TextField
                            fullWidth
                            label="Số điện thoại khánh hàng"
                            value={watch("client_phone")}
                          />
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Nút Tiếp theo / Quay lại */}
                <Box sx={{ mb: 2, mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={
                      activeStep === steps.length - 1
                        ? handleSubmitBooking
                        : handleNext
                    }
                    sx={{ mr: 1 }}
                  >
                    {activeStep === steps.length - 1 ? "Gửi" : "Tiếp theo"}
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
