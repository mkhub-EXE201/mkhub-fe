import React, { useState, useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination } from "swiper/modules";
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardMedia,
  Container,
  alpha,
  Skeleton,
} from "@mui/material";
import { VolumeUp, VolumeOff, KeyboardArrowUp } from "@mui/icons-material";
import CustomProfileCard from "../schedule-tabs/CustomProfileCard";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

// Import videos
import vid1 from "../../assets/vid1.mp4";
import vid2 from "../../assets/vid2.mp4";
import vid3 from "../../assets/vid3.mp4";
import vid4 from "../../assets/vid4.mp4";
import vid5 from "../../assets/vid5.mp4";
import vid6 from "../../assets/vid6.mp4";
import vid7 from "../../assets/vid7.mp4";

// Simple debounce utility function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const VideoCarousel = () => {
  const [videoStates, setVideoStates] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const videoRefs = useRef({});
  const [activeIndex, setActiveIndex] = useState(2);
  const swiperRef = useRef(null);

  // Centralized artist data to reduce duplication
  const defaultArtistData = {
    id: 101,
    name: "Phạm Minh Anh",
    avatar:
      "https://mkhub.s3.us-east-1.amazonaws.com/avatar/481471608_1685211615742480_1810824270755090645_n-439f6faa6ec5ca038e8442b00.jpg",
    location: "Quận 1, TP.HCM",
  };

  const videos = [
    {
      id: 1,
      title: "Biến hình thành gái anime",
      description: "Book ngay để được trải nghiệm thay đầu",
      videoSrc: vid1,
      artistData: defaultArtistData,
    },
    {
      id: 2,
      title: "Biến hình thành gái anime",
      description: "Book ngay để được trải nghiệm thay đầu",
      videoSrc: vid2,
      artistData: defaultArtistData,
    },
    {
      id: 3,
      title: "Biến hình thành gái anime",
      description: "Book ngay để được trải nghiệm thay đầu",
      videoSrc: vid3,
      artistData: defaultArtistData,
    },
    {
      id: 4,
      title: "Biến hình thành gái anime",
      description: "Book ngay để được trải nghiệm thay đầu",
      videoSrc: vid4,
      artistData: defaultArtistData,
    },
    {
      id: 5,
      title: "Makeup Kỷ yếu",
      description: "Layout nhẹ nhàng, trong trẻo và trẻ trung",
      videoSrc: vid5,
      artistData: defaultArtistData,
    },
    {
      id: 6,
      title: "Makeup Kỷ yếu",
      description: "Layout nhẹ nhàng, trong trẻo và trẻ trung.",
      videoSrc: vid6,
      artistData: defaultArtistData,
    },
    {
      id: 7,
      title: "Makeup Kỷ yếu",
      description: "Layout nhẹ nhàng, trong trẻo và trẻ trung.",
      videoSrc: vid7,
      artistData: defaultArtistData,
    },
  ];

  // Enhanced and optimized updateVideoState function with useCallback
  const updateVideoState = useCallback((videoId, updatedState) => {
    setVideoStates((prev) => {
      // Only update if there's an actual change to avoid unnecessary re-renders
      const currentState = prev[videoId] || {};
      const hasChange = Object.entries(updatedState).some(
        ([key, value]) => currentState[key] !== value
      );

      if (!hasChange) return prev;

      return {
        ...prev,
        [videoId]: { ...currentState, ...updatedState },
      };
    });
  }, []);

  const updateLoadingState = useCallback((videoId, isLoading) => {
    setLoadingStates((prev) => ({
      ...prev,
      [videoId]: isLoading,
    }));
  }, []);

  const toggleVideoPlay = useCallback(
    (videoId, e) => {
      e.stopPropagation();
      const video = videoRefs.current[videoId];
      if (video) {
        if (video.paused) {
          video.play();
          updateVideoState(videoId, { isPlaying: true });
        } else {
          video.pause();
          updateVideoState(videoId, { isPlaying: false });
        }
      }
    },
    [updateVideoState]
  );

  const toggleMute = useCallback(
    (videoId, e) => {
      e.stopPropagation();
      const video = videoRefs.current[videoId];
      if (video) {
        video.muted = !video.muted;
        updateVideoState(videoId, { isMuted: video.muted });
      }
    },
    [updateVideoState]
  );

  const pauseInactiveVideos = useCallback(
    (activeVideoId) => {
      Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
        const videoId = Number(id);
        if (videoId !== activeVideoId && videoEl && !videoEl.paused) {
          videoEl.pause();
          updateVideoState(videoId, { isPlaying: false });
        }
      });
    },
    [updateVideoState]
  );

  const playActiveVideo = useCallback(
    (videoId) => {
      if (videoId && videoRefs.current[videoId]) {
        const video = videoRefs.current[videoId];
        video.play().catch((error) => {
          console.log("Auto-play prevented:", error);
        });
        updateVideoState(videoId, { isPlaying: true });
        pauseInactiveVideos(videoId);
      }
    },
    [pauseInactiveVideos, updateVideoState]
  );

  const handleSlideChange = useCallback(
    (swiper) => {
      const newActiveIndex = swiper.realIndex;
      const previousActiveIndex = activeIndex;

      setActiveIndex(newActiveIndex);

      // Pause previous active video
      if (previousActiveIndex !== newActiveIndex) {
        const prevVideoId = videos[previousActiveIndex]?.id;
        if (prevVideoId && videoRefs.current[prevVideoId]) {
          videoRefs.current[prevVideoId].pause();
          updateVideoState(prevVideoId, { isPlaying: false });
        }
      }

      // Play new active video
      setTimeout(() => {
        const activeVideoId = videos[newActiveIndex]?.id;
        playActiveVideo(activeVideoId);
      }, 100);
    },
    [activeIndex, playActiveVideo, updateVideoState, videos]
  );

  const goToSlide = useCallback(
    (targetIndex) => {
      if (!swiperRef.current) return;

      const currentIndex = activeIndex;
      const totalSlides = videos.length;

      const forwardDistance =
        (targetIndex - currentIndex + totalSlides) % totalSlides;
      const backwardDistance =
        (currentIndex - targetIndex + totalSlides) % totalSlides;

      if (forwardDistance <= backwardDistance) {
        if (forwardDistance === 0) return;
        swiperRef.current.slideToLoop(targetIndex, 300);
      } else {
        let steps = backwardDistance;
        const slideStep = () => {
          if (steps > 0) {
            swiperRef.current.slidePrev(150);
            steps--;
            if (steps > 0) {
              setTimeout(slideStep, 50);
            }
          }
        };
        slideStep();
      }
    },
    [activeIndex, videos.length]
  );

  // Initialize video states and add cleanup
  useEffect(() => {
    // Initialize video and loading states
    const initialVideoStates = {};
    const initialLoadingStates = {};

    videos.forEach((video) => {
      initialVideoStates[video.id] = {
        isPlaying: false,
        isMuted: true,
      };
      initialLoadingStates[video.id] = true;
    });

    setVideoStates(initialVideoStates);
    setLoadingStates(initialLoadingStates);

    // Cleanup on component unmount
    return () => {
      Object.values(videoRefs.current).forEach((video) => {
        if (video && typeof video.pause === "function") {
          video.pause();
        }
      });
    };
  }, []);

  // Play active video when it's ready
  useEffect(() => {
    const activeVideoId = videos[activeIndex]?.id;
    if (activeVideoId && videoRefs.current[activeVideoId]) {
      const video = videoRefs.current[activeVideoId];
      if (video.readyState >= 2) {
        playActiveVideo(activeVideoId);
      }
    }
  }, [activeIndex, playActiveVideo, videos]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause all videos when tab is not visible
        Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
          if (videoEl && !videoEl.paused) {
            videoEl.pause();
            updateVideoState(Number(id), { isPlaying: false });
          }
        });
      } else {
        // Play only the active video when tab becomes visible again
        const activeVideoId = videos[activeIndex]?.id;
        if (activeVideoId) {
          playActiveVideo(activeVideoId);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [activeIndex, playActiveVideo, updateVideoState, videos]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = debounce(() => {
      const activeVideoId = videos[activeIndex]?.id;
      if (activeVideoId) {
        // Check if component is in viewport before playing
        const element = document.getElementById(
          `video-container-${activeVideoId}`
        );
        if (element) {
          const rect = element.getBoundingClientRect();
          const isInViewport =
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth;

          if (isInViewport) {
            playActiveVideo(activeVideoId);
          } else {
            const video = videoRefs.current[activeVideoId];
            if (video && !video.paused) {
              video.pause();
              updateVideoState(activeVideoId, { isPlaying: false });
            }
          }
        }
      }
    }, 150);

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [activeIndex, playActiveVideo, updateVideoState, videos]);

  // Reusable style objects to reduce inline style duplication
  const styles = {
    swiperContainer: {
      padding: "20px 0 90px",
    },
    activeCardWrapper: {
      width: "280px",
      height: "550px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      position: "relative",
      paddingBottom: "40px",
      paddingTop: "20px",
    },
    inactiveCardWrapper: {
      width: "280px",
      height: "450px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-start",
      position: "relative",
      paddingBottom: "40px",
      paddingTop: "20px",
    },
    getCardStyle: (isActive) => ({
      width: "100%",
      height: isActive ? "470px" : "380px",
      borderRadius: 4,
      position: "relative",
      overflow: "hidden",
      boxShadow: isActive ? 5 : 3,
      cursor: "pointer",
      transition: "all 0.6s ease",
      transform: isActive ? "translateY(-2%)" : "translateY(0)",
      zIndex: isActive ? 2 : 1,
      margin: isActive ? "0 0 10px 0" : "15% 0 10px 0",
    }),
    videoOverlay: (isActive) => ({
      position: "absolute",
      inset: 0,
      bgcolor: isActive ? "rgba(0, 0, 0, 0.15)" : "rgba(0, 0, 0, 0)",
      transition: "background-color 0.3s",
    }),
    getProfileCardStyle: (isActive) => ({
      position: "absolute",
      bottom: 0,
      width: isActive ? "90%" : "80%",
      zIndex: isActive ? 5 : 3,
      transform: isActive ? "translateY(20px)" : "translateY(80px) scale(0.8)",
      transformOrigin: "center bottom",
      opacity: isActive ? 1 : 0.85,
      transition:
        "opacity 0.8s ease, transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      minWidth: isActive ? "240px" : "200px",
    }),
    skeletonContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: "8px",
      bgcolor: "rgba(0, 0, 0, 0.04)",
    },
  };

  return (
    <Box sx={{ bgcolor: "white", py: 5, minHeight: "100vh" }}>
      <style>
        {`
                    .mySwiper .swiper-pagination-bullet {
                        background-color: #cccccc;
                        opacity: 0.5;
                    }
                    .mySwiper .swiper-pagination-bullet-active {
                        background-color: #091B65;
                        opacity: 1;
                    }
                `}
      </style>

      <Container maxWidth="lg">
        <Typography
          align="left"
          sx={{
            color: (theme) => theme.palette.darkBlue,
            fontSize: {
              xs: "24px",
              sm: "44px",
              md: "44px",
            },
            textTransform: "uppercase",
            fontWeight: 700,
            mb: 1,
            mt: 5,
          }}
        >
          Makeup Video
        </Typography>

        <Swiper
          slidesPerView={4}
          spaceBetween={20}
          freeMode={false}
          pagination={{
            clickable: true,
          }}
          loop={true}
          loopAdditionalSlides={1}
          modules={[FreeMode, Pagination]}
          centeredSlides={true}
          className="mySwiper"
          style={styles.swiperContainer}
          onSlideChange={handleSlideChange}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          initialSlide={2}
          speed={300}
          allowTouchMove={true}
          watchSlidesProgress={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 20,
            },
          }}
        >
          {videos.map((video, index) => {
            const isActive = index === activeIndex;
            const videoState = videoStates[video.id] || {};
            const isLoading = loadingStates[video.id] || false;

            return (
              <SwiperSlide
                key={`${video.id}-${index}`}
                style={
                  isActive
                    ? styles.activeCardWrapper
                    : styles.inactiveCardWrapper
                }
              >
                <Card
                  id={`video-container-${video.id}`}
                  sx={styles.getCardStyle(isActive)}
                  onClick={() => {
                    if (!isActive) {
                      goToSlide(index);
                    } else {
                      toggleVideoPlay(video.id, { stopPropagation: () => {} });
                    }
                  }}
                >
                  {isLoading && (
                    <Box sx={styles.skeletonContainer}>
                      <Skeleton
                        animation="wave"
                        variant="rectangular"
                        width="100%"
                        height="100%"
                        sx={{
                          bgcolor: "grey.300",
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                        }}
                      />
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          width: "100%",
                          p: 2,
                        }}
                      >
                        <Skeleton
                          animation="wave"
                          height={20}
                          width="60%"
                          sx={{ bgcolor: "grey.200" }}
                        />
                        <Skeleton
                          animation="wave"
                          height={15}
                          width="80%"
                          sx={{ bgcolor: "grey.200", mt: 1 }}
                        />
                      </Box>
                    </Box>
                  )}
                  <CardMedia
                    component="video"
                    ref={(el) => (videoRefs.current[video.id] = el)}
                    height="100%"
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: isLoading ? "none" : "block",
                    }}
                    muted
                    loop
                    playsInline
                    poster={video.thumbnail}
                    onLoadedData={() => {
                      const videoEl = videoRefs.current[video.id];
                      if (videoEl) {
                        videoEl.currentTime = 1;
                        updateLoadingState(video.id, false);

                        if (isActive) {
                          videoEl.play().catch((err) => console.log(err));
                          updateVideoState(video.id, { isPlaying: true });
                        } else {
                          videoEl.pause();
                          updateVideoState(video.id, { isPlaying: false });
                        }
                      }
                    }}
                    onPlay={() => {
                      if (!isActive) {
                        const videoEl = videoRefs.current[video.id];
                        if (videoEl) {
                          videoEl.pause();
                          updateVideoState(video.id, { isPlaying: false });
                        }
                      }
                    }}
                    onError={() => {
                      console.error(`Error loading video ${video.id}`);
                      updateLoadingState(video.id, false);
                    }}
                  >
                    <source src={video.videoSrc} type="video/mp4" />
                  </CardMedia>

                  {!isLoading && (
                    <Box sx={styles.videoOverlay(isActive)}>
                      <IconButton
                        sx={{
                          position: "absolute",
                          top: 12,
                          right: 12,
                          bgcolor: alpha("#000", 0.7),
                          color: "white",
                          p: 1,
                          opacity: isActive ? 0.8 : 0,
                          transition: "opacity 0.3s",
                        }}
                        onClick={(e) => toggleMute(video.id, e)}
                      >
                        {videoState.isMuted ? (
                          <VolumeOff fontSize="small" />
                        ) : (
                          <VolumeUp fontSize="small" />
                        )}
                      </IconButton>

                      <Box
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.5), transparent)",
                          p: 2,
                          color: "white",
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: isActive ? 600 : 500,
                                mb: 0.5,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {video.title}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ color: "grey.300" }}
                            >
                              {video.description}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              ml: 2,
                            }}
                          >
                            <IconButton
                              sx={{
                                color: "white",
                                p: 1,
                                "&:hover": {
                                  bgcolor: "rgba(255, 255, 255, 0.2)",
                                },
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <KeyboardArrowUp fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Card>

                <Box sx={styles.getProfileCardStyle(isActive)}>
                  {isLoading ? (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={isActive ? 50 : 40}
                      sx={{ borderRadius: 1 }}
                    />
                  ) : (
                    <CustomProfileCard
                      isHome={true}
                      customerData={video.artistData}
                      width="100%"
                      height={isActive ? "50px" : "40px"}
                      buttonText="Đặt lịch"
                      avatarSize={isActive ? "40px" : "30px"}
                      nameTextSize={isActive ? "14px" : "12px"}
                      locationTextSize={isActive ? "10px" : "9px"}
                      buttonTextSize={isActive ? "10px" : "9px"}
                      buttonSize="small"
                      customStyles={{
                        customerInfo: {
                          boxShadow: isActive
                            ? "0px 2px 4px rgba(0,0,0,0.1)"
                            : "none",
                          backgroundColor: "white",
                          border: isActive ? "1px solid #eaeaea" : "none",
                          minHeight: "50px",
                          transition: "all 0.3s ease",
                          whiteSpace: "nowrap",
                        },
                        profileContainer: {
                          padding: isActive ? "8px" : "4px",
                          width: "100%",
                          transition: "all 0.3s ease",
                        },
                        nameText: {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                        locationText: {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                    />
                  )}
                </Box>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </Container>
    </Box>
  );
};

export default VideoCarousel;
