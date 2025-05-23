import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Pagination } from 'swiper/modules';
import {
    Box,
    IconButton,
    Typography,
    Card,
    CardMedia,
    alpha
} from '@mui/material';
import {
    PlayArrow,
    PauseCircle,
    VolumeUp,
    VolumeOff,
    Add,
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
            title: "lumizing z I'm Black",
            views: "1,000",
            thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid1
        },
        {
            id: 2,
            title: "Trace'd Out Longwear Waterproof Pencil Lip",
            views: "658,000",
            thumbnail: "https://images.unsplash.com/photo-1583001809302-91e0b9a29b83?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid2
        },
        {
            id: 3,
            title: "Invisimatte Instant Setting + Blotting",
            views: "1,250,000",
            thumbnail: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid3
        },
        {
            id: 4,
            title: "The Homecurl Curl-Defining Cream",
            views: "954,000",
            thumbnail: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid4
        },
        {
            id: 5,
            title: "The Rich Or Repair Shampoo",
            views: "802,200",
            thumbnail: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=300&h=400&fit=crop&crop=face",
            videoSrc: vid1 // Reusing the first video for the fifth item
        }
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

    // Handle slide change to update active index and play video
    const handleSlideChange = (swiper) => {
        const newActiveIndex = swiper.activeIndex;
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
            }
        }, 100);
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

        // Play the initial active video
        return () => {
            // Cleanup: pause all videos when component unmounts
            Object.values(videoRefs.current).forEach(video => {
                if (video && typeof video.pause === 'function') {
                    video.pause();
                }
            });
        };
    }, []);

    // Auto-play the active video when it's loaded
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
            }
        }
    }, [activeIndex, videos]);

    return (
        <Box sx={{ bgcolor: 'grey.100', minHeight: '100vh', py: 3 }}>
            <Swiper
                slidesPerView="auto"
                spaceBetween={16}
                freeMode={true}
                pagination={{
                    clickable: true,
                }}
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
                    const isActive = index === activeIndex;
                    const videoState = videoStates[video.id] || {};
                    const isPlaying = videoState.isPlaying || false;

                    return (
                        <SwiperSlide
                            key={video.id}
                            style={{
                                width: isActive ? '280px' : '280px',
                                height: isActive ? '490px' : '390px',
                                transition: 'width 0.3s, height 0.3s',
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
                                    // If this isn't the active slide, make it active
                                    if (index !== activeIndex && swiperRef.current) {
                                        swiperRef.current.slideTo(index);
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
                                            if (isActive) {
                                                videoEl.play().catch(err => console.log(err));
                                                setVideoStates(prev => ({
                                                    ...prev,
                                                    [video.id]: { ...prev[video.id], isPlaying: true }
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
                                    {/* Time indicator */}
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: 'absolute',
                                            top: 12,
                                            left: 12,
                                            bgcolor: alpha('#000', 0.7),
                                            color: 'white',
                                            px: 1,
                                            py: 0.5,
                                            borderRadius: 1
                                        }}
                                    >
                                        1:00
                                    </Typography>

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
                                                    {video.views}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
                                                <IconButton
                                                    sx={{
                                                        bgcolor: 'white',
                                                        color: 'black',
                                                        mb: 1,
                                                        '&:hover': {
                                                            bgcolor: 'grey.100'
                                                        },
                                                        p: 1
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Add fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    sx={{
                                                        color: 'white',
                                                        p: 1
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
        </Box>
    );
};

export default VideoCarousel;