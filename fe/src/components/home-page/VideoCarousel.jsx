import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import {
    Box,
    IconButton,
    Typography,
    Card,
    CardMedia,
    Container,
    alpha
} from '@mui/material';
import {
    VolumeUp,
    VolumeOff,
    KeyboardArrowUp
} from '@mui/icons-material';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

// Import the video files
import vid1 from '../../assets/vid1.mp4';
import vid2 from '../../assets/vid2.mp4';
import vid3 from '../../assets/vid3.mp4';
import vid4 from '../../assets/vid4.mp4';
import vid5 from '../../assets/vid5.mp4';
import vid6 from '../../assets/vid6.mp4';
import vid7 from '../../assets/vid7.mp4';

const VideoCarousel = () => {
    const [videoStates, setVideoStates] = useState({});
    const videoRefs = useRef({});
    const [activeIndex, setActiveIndex] = useState(2);
    const swiperRef = useRef(null);

    const videos = [
        {
            id: 1,
            title: "Biến hình thành gái anime",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid1
        },
        {
            id: 2,
            title: "Biến hình thành gái anime",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            thumbnail: "https://images.unsplash.com/photo-1583001809302-91e0b9a29b83?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid2
        },
        {
            id: 3,
            title: "Biến hình thành gái anime",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            thumbnail: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid3
        },
        {
            id: 4,
            title: "Biến hình thành gái anime",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
            thumbnail: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid4
        },
        {
            id: 5,
            title: "Makeup Tutorial",
            description: "Step by step makeup tutorial for beginners.",
            thumbnail: "https://images.unsplash.com/photo-1503236823255-94609f598e71?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid5
        },
        {
            id: 6,
            title: "Professional Makeup Tips",
            description: "Learn professional makeup techniques for special occasions.",
            thumbnail: "https://images.unsplash.com/photo-1596704017243-78587f79ab5a?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid6
        },
        {
            id: 7,
            title: "Natural Makeup Look",
            description: "Create a beautiful natural makeup look for everyday wear.",
            thumbnail: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid7
        },
    ];

    const toggleVideoPlay = (videoId, e) => {
        e.stopPropagation();
        const video = videoRefs.current[videoId];
        if (video) {
            if (video.paused) {
                video.play();
                setVideoStates(prev => ({ ...prev, [videoId]: { ...prev[videoId], isPlaying: true } }));
            } else {
                video.pause();
                setVideoStates(prev => ({ ...prev, [videoId]: { ...prev[videoId], isPlaying: false } }));
            }
        }
    };

    const toggleMute = (videoId, e) => {
        e.stopPropagation();
        const video = videoRefs.current[videoId];
        if (video) {
            video.muted = !video.muted;
            setVideoStates(prev => ({
                ...prev,
                [videoId]: { ...prev[videoId], isMuted: video.muted }
            }));
        }
    };

    const pauseInactiveVideos = (activeVideoId) => {
        Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
            const videoId = Number(id);
            if (videoId !== activeVideoId && videoEl && !videoEl.paused) {
                videoEl.pause();
                setVideoStates(prev => ({
                    ...prev,
                    [videoId]: { ...prev[videoId], isPlaying: false }
                }));
            }
        });
    };

    const handleSlideChange = (swiper) => {
        const newActiveIndex = swiper.realIndex;
        const previousActiveIndex = activeIndex;

        setActiveIndex(newActiveIndex);

        // Pause previous active video
        if (previousActiveIndex !== newActiveIndex) {
            const prevVideoId = videos[previousActiveIndex]?.id;
            if (prevVideoId && videoRefs.current[prevVideoId]) {
                videoRefs.current[prevVideoId].pause();
                setVideoStates(prev => ({
                    ...prev,
                    [prevVideoId]: { ...prev[prevVideoId], isPlaying: false }
                }));
            }
        }

        // Play new active video
        setTimeout(() => {
            const activeVideoId = videos[newActiveIndex]?.id;
            if (activeVideoId && videoRefs.current[activeVideoId]) {
                const video = videoRefs.current[activeVideoId];
                video.play().catch(error => {
                    console.log('Auto-play prevented:', error);
                });
                setVideoStates(prev => ({
                    ...prev,
                    [activeVideoId]: { ...prev[activeVideoId], isPlaying: true }
                }));
                pauseInactiveVideos(activeVideoId);
            }
        }, 100);
    };

    const goToSlide = (targetIndex) => {
        if (!swiperRef.current) return;

        const currentIndex = activeIndex;
        const totalSlides = videos.length;

        const forwardDistance = (targetIndex - currentIndex + totalSlides) % totalSlides;
        const backwardDistance = (currentIndex - targetIndex + totalSlides) % totalSlides;

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
    };

    useEffect(() => {
        const initialStates = {};
        videos.forEach(video => {
            initialStates[video.id] = {
                isPlaying: false,
                isMuted: true
            };
        });
        setVideoStates(initialStates);

        return () => {
            Object.values(videoRefs.current).forEach(video => {
                if (video && typeof video.pause === 'function') {
                    video.pause();
                }
            });
        };
    }, []);

    useEffect(() => {
        const activeVideoId = videos[activeIndex]?.id;
        if (activeVideoId && videoRefs.current[activeVideoId]) {
            const video = videoRefs.current[activeVideoId];
            if (video.readyState >= 2) {
                video.play().catch(error => {
                    console.log('Auto-play prevented:', error);
                });
                setVideoStates(prev => ({
                    ...prev,
                    [activeVideoId]: { ...prev[activeVideoId], isPlaying: true }
                }));
                pauseInactiveVideos(activeVideoId);
            }
        }
    }, [activeIndex, videos]);

    return (
        <Box sx={{ bgcolor: 'white', py: 5, minHeight: '100vh' }}>
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
                    style={{ padding: '20px 0 100px' }}

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

                        return (
                            <SwiperSlide
                                key={`${video.id}-${index}`}
                                style={{
                                    width: '280px',
                                    height: isActive ? '480px' : '400px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: isActive ? '100%' : '90%',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: isActive ? 5 : 3,
                                        cursor: 'pointer',
                                        transition: 'all 0.6s ease',
                                        transform: isActive ? 'translateY(-3%)' : 'translateY(0)',
                                        zIndex: isActive ? 2 : 1,
                                        margin: isActive ? '0' : '15% 0', // Center inactive cards vertically
                                    }}
                                    onClick={() => {
                                        if (!isActive) {
                                            goToSlide(index);
                                        } else {
                                            toggleVideoPlay(video.id, { stopPropagation: () => { } });
                                        }
                                    }}
                                >
                                    <CardMedia
                                        component="video"
                                        ref={el => videoRefs.current[video.id] = el}
                                        height="100%"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                        muted
                                        loop
                                        playsInline
                                        poster={video.thumbnail}
                                        onLoadedData={() => {
                                            const videoEl = videoRefs.current[video.id];
                                            if (videoEl) {
                                                videoEl.currentTime = 1;
                                                if (isActive) {
                                                    videoEl.play().catch(err => console.log(err));
                                                    setVideoStates(prev => ({
                                                        ...prev,
                                                        [video.id]: { ...prev[video.id], isPlaying: true }
                                                    }));
                                                } else {
                                                    videoEl.pause();
                                                    setVideoStates(prev => ({
                                                        ...prev,
                                                        [video.id]: { ...prev[video.id], isPlaying: false }
                                                    }));
                                                }
                                            }
                                        }}
                                        onPlay={() => {
                                            if (!isActive) {
                                                const videoEl = videoRefs.current[video.id];
                                                if (videoEl) {
                                                    videoEl.pause();
                                                    setVideoStates(prev => ({
                                                        ...prev,
                                                        [video.id]: { ...prev[video.id], isPlaying: false }
                                                    }));
                                                }
                                            }
                                        }}
                                    >
                                        <source src={video.videoSrc} type="video/mp4" />
                                    </CardMedia>

                                    <Box
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            bgcolor: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0)',
                                            transition: 'background-color 0.3s',
                                        }}
                                    >
                                        <IconButton
                                            sx={{
                                                position: 'absolute',
                                                top: 12,
                                                right: 12,
                                                bgcolor: alpha('#000', 0.7),
                                                color: 'white',
                                                p: 1,
                                                opacity: isActive ? 0.8 : 0,
                                                transition: 'opacity 0.3s'
                                            }}
                                            onClick={(e) => toggleMute(video.id, e)}
                                        >
                                            {videoState.isMuted ? <VolumeOff fontSize="small" /> : <VolumeUp fontSize="small" />}
                                        </IconButton>

                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.5), transparent)',
                                                p: 2,
                                                color: 'white'
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: isActive ? 600 : 500,
                                                            mb: 0.5,
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {video.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: 'grey.300' }}>
                                                        {video.description}
                                                    </Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
                                                    <IconButton
                                                        sx={{
                                                            color: 'white',
                                                            p: 1,
                                                            '&:hover': {
                                                                bgcolor: 'rgba(255, 255, 255, 0.2)'
                                                            }
                                                        }}
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <KeyboardArrowUp fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </Box>
                                </Card>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </Container>
        </Box>
    );
};

export default VideoCarousel;