import React from "react";
import { motion } from "framer-motion";
import { Box } from "@mui/material";
import PropTypes from 'prop-types';

// Animation variants for the right-to-left slide transition with fade
const imageVariants = {
    enter: (direction) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        transition: {
            opacity: { duration: 0.3, ease: "easeOut" }, // Fade out first
            x: { duration: 0.5, delay: 0.2, ease: "easeInOut" }, // Then slide out
        },
    }),
};

// Animation variants for content - updated to match image slide-fade effect
const contentVariants = {
    enter: (direction) => ({
        x: direction > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    visible: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? "100%" : "-100%",
        opacity: 0,
        transition: {
            opacity: { duration: 0.3, ease: "easeOut" }, // Fade out first
            x: { duration: 0.5, delay: 0.3, ease: "easeInOut" }, // Then slide out
        },
    }),
};

// Animation variants for text
const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

// Animated Image component with right-to-left slide transition and fade effect
const AnimatedImage = ({
    src,
    alt,
    slideKey,
    delay = 0,
    style = {},
    containerSx = {},
}) => {
    return (
        <Box sx={{ overflow: "hidden", ...containerSx }}>
            <motion.img
                key={slideKey}
                src={src}
                alt={alt}
                custom={1} // Direction: positive means slide from right to left
                variants={imageVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                    x: { type: "spring", stiffness: 270, damping: 32, delay: 0.1 },
                    opacity: { duration: 0.7 },
                    delay: delay + 0.2, // Add additional delay for smoother transition
                }}
                style={style}
            />
        </Box>
    );
};

// Animated Content component - updated to use the slide-fade animation
const AnimatedContent = ({ children, slideKey, delay = 0, style = {} }) => {
    return (
        <motion.div
            key={slideKey}
            custom={1} // Direction: positive means slide from right to left
            variants={contentVariants}
            initial="enter"
            animate="visible"
            exit="exit"
            transition={{
                x: { type: "spring", stiffness: 270, damping: 32, delay: 0.1 },
                opacity: { duration: 0.5 },
                delay: delay + 0.3, // Slightly more delay for content to follow after image
            }}
            style={style}
        >
            {children}
        </motion.div>
    );
};

// Animated Text component
const AnimatedText = ({ children, slideKey, delay = 0, style = {} }) => {
    return (
        <motion.div
            key={slideKey}
            variants={textVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.4, delay }}
            style={style}
        >
            {children}
        </motion.div>
    );
};


AnimatedImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    slideKey: PropTypes.string.isRequired,
    delay: PropTypes.number,
    style: PropTypes.object,
    containerSx: PropTypes.object
};


AnimatedContent.propTypes = {
    children: PropTypes.node.isRequired,
    slideKey: PropTypes.string.isRequired,
    delay: PropTypes.number,
    style: PropTypes.object
};


AnimatedText.propTypes = {
    children: PropTypes.node.isRequired,
    slideKey: PropTypes.string.isRequired,
    delay: PropTypes.number,
    style: PropTypes.object
};

const AnimatedComponents = {
    AnimatedImage,
    AnimatedContent,
    AnimatedText,
};

export default AnimatedComponents;