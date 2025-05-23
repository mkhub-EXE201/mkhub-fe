import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Modal, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import CloseIcon from "@mui/icons-material/Close";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

// Import video files
import video1 from "../../assets/vid1.mp4";
import video2 from "../../assets/vid2.mp4";
import video3 from "../../assets/vid3.mp4";
import video4 from "../../assets/vid4.mp4";

const VideoThumbnail = styled("div")({
    position: "relative",
    width: "200px",
    height: "300px",
    margin: "0 10px",
    overflow: "hidden",
    borderRadius: "8px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
});

const PlayButton = styled(Button)({
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
});

const VideoModal = styled(Modal)({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

const VideoContainer = styled(Box)({
    position: "relative",
    width: "80%",
    maxWidth: "800px",
    backgroundColor: "#000",
    borderRadius: "8px",
    overflow: "hidden",
});

const CloseButton = styled(IconButton)({
    position: "absolute",
    right: "10px",
    top: "10px",
    color: "#fff",
    zIndex: 1000,
});

const VideoCarousel = () => {
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [open, setOpen] = useState(false);
    const [thumbnails, setThumbnails] = useState({});
    const [loading, setLoading] = useState(true);

    const videos = [
        {
            id: 1,
            video: video1,
            title: "lumizing z I'm Black",
            views: "1,000",
        },
        {
            id: 2,
            video: video2,
            title: "Trace'd Out Longwear Waterproof Pencil Lip",
            views: "658,000",
        },
        {
            id: 3,
            video: video3,
            title: "Invisimatte Instant Setting + Blotting",
            views: "1,250,000",
        },
        {
            id: 4,
            video: video4,
            title: "The Homecurl Curl-Defining Cream",
            views: "954,000",
        },
    ];

    useEffect(() => {
        // Generate thumbnails from videos
        let loadedCount = 0;
        setLoading(true);

        videos.forEach(videoItem => {
            const video = document.createElement('video');
            video.crossOrigin = "anonymous"; // Add this for CORS issues
            video.src = videoItem.video;

            video.addEventListener('loadeddata', () => {
                video.currentTime = 0.5; // Set to a specific time (0.5 seconds)

                // Wait for video to seek to the specified time
                video.addEventListener('seeked', () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    setThumbnails(prev => ({
                        ...prev,
                        [videoItem.id]: canvas.toDataURL()
                    }));

                    loadedCount++;
                    if (loadedCount === videos.length) {
                        setLoading(false);
                    }
                }, { once: true });
            });

            // Handle errors
            video.addEventListener('error', () => {
                console.error('Error loading video for thumbnail', videoItem.id);
                setThumbnails(prev => ({
                    ...prev,
                    [videoItem.id]: `https://via.placeholder.com/200x300?text=Video+${videoItem.id}`
                }));

                loadedCount++;
                if (loadedCount === videos.length) {
                    setLoading(false);
                }
            });
        });
    }, []);

    const handlePlay = (videoSrc) => {
        setSelectedVideo(videoSrc);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedVideo(null);
    };

    return (
        <>
            <Box sx={{ padding: "20px", overflowX: "auto", whiteSpace: "nowrap" }}>
                {videos.map((video) => (
                    <VideoThumbnail
                        key={video.id}
                        style={{
                            backgroundImage: thumbnails[video.id]
                                ? `url(${thumbnails[video.id]})`
                                : "url(https://via.placeholder.com/200x300?text=Loading...)",
                            backgroundColor: !thumbnails[video.id] ? "#333" : "transparent"
                        }}
                        onClick={() => handlePlay(video.video)}
                    >
                        <PlayButton>
                            <PlayArrowIcon />
                            <Typography variant="body2" sx={{ ml: 1 }}>{video.views}</Typography>
                        </PlayButton>
                        <Typography
                            variant="caption"
                            sx={{
                                position: "absolute",
                                bottom: "10px",
                                color: "#fff",
                                backgroundColor: "rgba(0,0,0,0.5)",
                                padding: "5px",
                                width: "100%",
                                textAlign: "center"
                            }}
                        >
                            {video.title}
                        </Typography>
                    </VideoThumbnail>
                ))}
            </Box>

            <VideoModal
                open={open}
                onClose={handleClose}
                aria-labelledby="video-player-modal"
                aria-describedby="video-player"
            >
                <VideoContainer>
                    <CloseButton onClick={handleClose}>
                        <CloseIcon />
                    </CloseButton>
                    {selectedVideo && (
                        <video
                            width="100%"
                            controls
                            autoPlay
                            src={selectedVideo}
                        >
                            Your browser does not support the video tag.
                        </video>
                    )}
                </VideoContainer>
            </VideoModal>
        </>
    );
};

export default VideoCarousel;