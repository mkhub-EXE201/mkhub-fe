import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Tab,
  Tabs,
  Typography,
  ImageList,
  ImageListItem,
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
import { AppContext } from "../contexts/app.context";
import PostModal from "../components/PostModal";
import ChatBox from "../components/Chatbox";
import BookingModal from "../components/BookingModal";

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
  };

  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [selectedPost, setSelectedPost] = useState({});
  const [reactions, setReactions] = useState([]);
  const [myReaction, setMyReaction] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        console.log(response.data.result);
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
                    {profile &&
                      profile.portfolio_url &&
                      profile.portfolio_url.map((item) => (
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
                <Button
                  onClick={() => setIsChatOpen(true)}
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
                </Button>
                {isChatOpen && (
                  <ChatBox
                    artist={profile}
                    client={userProfileFromContext}
                    onClose={() => setIsChatOpen(false)}
                  />
                )}
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

                      <CardContent
                        sx={{
                          flex: "1 1 auto",
                          display: "flex",
                          flexDirection: "column",
                          px: 2,
                          pt: 2,
                          pb: 0,
                        }}
                      >
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
                            lineHeight: "1.4em",
                            minHeight: "2.8em",
                            flexShrink: 0,
                          }}
                        >
                          {item.description}
                        </Typography>

                        <Typography
                          sx={{ mt: "auto", fontWeight: "600", fontSize: 14 }}
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
                          pt: 1,
                        }}
                      >
                        <Button
                          onClick={() => setIsChatOpen(true)}
                          size="small"
                          variant="outlined"
                        >
                          Liên hệ
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
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
                  <ImageList variant="woven" cols={5} gap={8}>
                    {photos.map((item) => (
                      <ImageListItem key={item}>
                        <img
                          srcSet={`${item}?w=161&fit=crop&auto=format&dpr=2 2x`}
                          src={`${item}?w=161&fit=crop&auto=format`}
                          loading="lazy"
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
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
        <BookingModal
          currentModal={currentModal}
          closeModal={closeModal}
          user={userProfileFromContext}
          artistId={id}
          artistProfile={profile}
          selectedService={selectedService}
        />
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
