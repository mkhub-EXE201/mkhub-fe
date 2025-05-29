import React from "react";
import { Box } from "@mui/material";

const SlideIndicators = ({ currentSlide, totalSlides, onSlideChange }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 3,
                position: 'absolute',
                bottom: 20,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10
            }}
        >
            {Array.from({ length: totalSlides }, (_, index) => (
                <Box
                    key={index}
                    onClick={() => onSlideChange(index)}
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        backgroundColor: currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.5)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                            backgroundColor: 'white',
                            transform: 'scale(1.2)'
                        }
                    }}
                />
            ))}
        </Box>
    );
};


export default SlideIndicators;