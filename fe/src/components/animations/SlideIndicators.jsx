import React from "react";
import { Box } from "@mui/material";
import PropTypes from 'prop-types';

const SlideIndicators = ({ currentSlide, totalSlides, onSlideChange, containerSx = {} }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                position: 'absolute',
                bottom: 10,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 10,
                ...containerSx // Allow custom styling from parent
            }}
        >
            {Array.from({ length: totalSlides }, (_, index) => (
                <Box
                    key={index}
                    onClick={() => onSlideChange(index)}
                    sx={{
                        width: 8,
                        height: 8,
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

SlideIndicators.propTypes = {
    currentSlide: PropTypes.number.isRequired,
    totalSlides: PropTypes.number.isRequired,
    onSlideChange: PropTypes.func.isRequired,
    containerSx: PropTypes.object
};

SlideIndicators.defaultProps = {
    containerSx: {}
};

export default SlideIndicators;