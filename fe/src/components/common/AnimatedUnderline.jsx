import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

export const AnimatedUnderline = ({ children, color = "#F13067", textColor }) => {
    return (
        <Box sx={{
            position: "relative",
            display: "inline-block",
            padding: "2px 0",
            "&:hover::after": {
                transform: "scaleX(1)",
                opacity: 1
            },
            "&::after": {
                content: '""',
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "3px",
                backgroundColor: color,
                transform: "scaleX(0)",
                transformOrigin: "center",
                transition: "transform 0.3s ease, opacity 0.3s ease",
                opacity: 0,
                borderRadius: "1px"
            }
        }}>
            {React.cloneElement(children, {
                sx: {
                    ...children.props.sx,
                    position: "relative",
                    zIndex: 1,
                    color: textColor || children.props.color
                }
            })}
        </Box>
    );
};

// AnimatedUnderlineLink for navigation items
export const AnimatedUnderlineLink = ({ to, label, isScrolled, color = "#F13067" }) => {
    return (
        <Link to={to} style={{ textDecoration: "none", color: "inherit" }}>
            <AnimatedUnderline color={color}>
                <Typography color={isScrolled ? "black" : "white"}>
                    {label}
                </Typography>
            </AnimatedUnderline>
        </Link>
    );
};

AnimatedUnderline.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    textColor: PropTypes.string
};

AnimatedUnderlineLink.propTypes = {
    to: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    isScrolled: PropTypes.bool.isRequired,
    color: PropTypes.string
};

export default AnimatedUnderlineLink;
