import React from "react";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";

const slideVariants = {
    enter: { x: "100%", opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: "-100%", opacity: 0, scale: 0.95 },
};

// Use a consistent animation duration for synchronization
const animationConfig = { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] };

export const AnimatedImage = ({ src, alt, slideKey, style = {}, delay = 0, containerSx = {} }) => (
    <Box sx={{ position: "relative", overflow: "hidden", ...containerSx }}>
        <AnimatePresence mode="wait">
            <motion.img
                key={slideKey}
                src={src}
                alt={alt}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={animationConfig}
                style={{ position: "absolute", top: 0, left: 0, ...style }}
            />
        </AnimatePresence>
    </Box>
);

export const AnimatedText = ({ slideKey, children, delay = 0, style = {} }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={slideKey}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={animationConfig}
            style={style}
        >
            {children}
        </motion.div>
    </AnimatePresence>
);

export const AnimatedContent = ({ slideKey, children, delay = 0, style = {} }) => (
    <AnimatePresence mode="wait">
        <motion.div
            key={slideKey}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={animationConfig}
            style={style}
        >
            {children}
        </motion.div>
    </AnimatePresence>
);

const AnimatedComponents = {
    AnimatedImage,
    AnimatedText,
    AnimatedContent
};

export default AnimatedComponents;