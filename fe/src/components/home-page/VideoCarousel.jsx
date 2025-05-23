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

const VideoCarousel = () => {
    const [videoStates, setVideoStates] = useState({});
    const videoRefs = useRef({});
    const [activeIndex, setActiveIndex] = useState(2);
    const swiperRef = useRef(null);

    // Updated video data to use local video files
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

    // Stop all videos except the active one
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

    // Handle slide change to update active index and play video
    const handleSlideChange = (swiper) => {
        const newActiveIndex = swiper.realIndex; // Use realIndex instead of activeIndex for loop mode
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

        // Play new active video after a small delay to ensure smooth transition
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

                // Ensure all other videos are paused
                pauseInactiveVideos(activeVideoId);
            }
        }, 200);
    };

    useEffect(() => {
        // Initialize video states
        const initialStates = {};
        videos.forEach(video => {
            initialStates[video.id] = {
                isPlaying: false,
                isMuted: true
            };
        });
        setVideoStates(initialStates);

        // Cleanup: pause all videos when component unmounts
        return () => {
            Object.values(videoRefs.current).forEach(video => {
                if (video && typeof video.pause === 'function') {
                    video.pause();
                }
            });
        };
    }, []);

    // Auto-play the active video when it's loaded and ensure other videos are stopped
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

                // Make sure all other videos are paused
                pauseInactiveVideos(activeVideoId);
            }
        }
    }, [activeIndex, videos]);

    return (
        <Box sx={{ bgcolor: 'white', py: 5, minHeight: '100vh' }}>
            <Container maxWidth="lg">
                {/* Section Title */}
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

                {/* Video Carousel */}
                <Swiper
                    slidesPerView={4}  // Show 3 slides at once
                    spaceBetween={20}
                    freeMode={true}
                    pagination={{
                        clickable: true,
                    }}
                    loop={true}
                    loopAdditionalSlides={4}  // Add extra slides for smoother looping
                    modules={[FreeMode, Pagination]}
                    centeredSlides={true}
                    className="mySwiper"
                    style={{ padding: '20px 0' }}
                    onSlideChange={handleSlideChange}
                    onSwiper={(swiper) => {
                        swiperRef.current = swiper;
                    }}
                    initialSlide={2} // Start with middle slide active
                >
                    {videos.map((video, index) => {
                        // In loop mode, use realIndex from the swiper ref if available
                        const isActive = swiperRef.current ?
                            index === swiperRef.current.realIndex :
                            index === activeIndex;

                        const videoState = videoStates[video.id] || {};
                        const isPlaying = videoState.isPlaying || false;

                        return (
                            <SwiperSlide
                                key={video.id}
                                style={{
                                    width: '280px',  // Set fixed width for all slides
                                    height: isActive ? '490px' : '390px',
                                    transition: 'width 0.3s, height 0.3s',
                                    display: 'flex',  // Ensure content is centered
                                    justifyContent: 'center',
                                }}
                            >
                                <Card
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: 4,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        boxShadow: isActive ? 5 : 3,
                                        transform: isActive ? 'scale(1.05)' : 'scale(1)',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        zIndex: isActive ? 2 : 1,
                                        '&:hover .overlay': {
                                            bgcolor: 'rgba(0, 0, 0, 0.3)'
                                        },
                                        '&:hover .controls': {
                                            opacity: 1
                                        }
                                    }}
                                    onClick={() => {
                                        // If this isn't the active slide, make it active and play it
                                        if (index !== activeIndex && swiperRef.current) {
                                            // For loop mode, we need to handle the slide indexes differently
                                            const realIndex = swiperRef.current.realIndex;
                                            const indexDiff = index - realIndex;

                                            // Calculate how many slides to move, accounting for the shortest path in loop mode
                                            let slidesToMove = indexDiff;
                                            if (Math.abs(indexDiff) > videos.length / 2) {
                                                slidesToMove = indexDiff - Math.sign(indexDiff) * videos.length;
                                            }

                                            swiperRef.current.slideToLoop(index);
                                        } else {
                                            // If already active, toggle play/pause
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
                                                // Only allow the active video to play
                                                if (isActive) {
                                                    videoEl.play().catch(err => console.log(err));
                                                    setVideoStates(prev => ({
                                                        ...prev,
                                                        [video.id]: { ...prev[video.id], isPlaying: true }
                                                    }));
                                                } else {
                                                    // Ensure inactive videos are paused
                                                    videoEl.pause();
                                                    setVideoStates(prev => ({
                                                        ...prev,
                                                        [video.id]: { ...prev[video.id], isPlaying: false }
                                                    }));
                                                }
                                            }
                                        }}
                                        // Add onPlay event handler to ensure inactive videos can't play
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

                                    {/* Overlay */}
                                    <Box
                                        className="overlay"
                                        sx={{
                                            position: 'absolute',
                                            inset: 0,
                                            bgcolor: isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0)',
                                            transition: 'background-color 0.3s',
                                        }}
                                    >
                                        {/* Volume Control */}
                                        <IconButton
                                            className="controls"
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

                                        {/* Bottom Info */}
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