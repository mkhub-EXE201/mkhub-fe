import React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import PropTypes from 'prop-types';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScroll = ({ children }) => {
    const smootherContainerRef = useRef(null);

    useEffect(() => {
        ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: 1,
            effects: true,
        });
    }, []);

    return (
        <div id="smooth-wrapper" ref={smootherContainerRef}>
            <div id="smooth-content">
                {children}
            </div>
        </div>
    );
};

SmoothScroll.propTypes = {
    children: PropTypes.node.isRequired
};

export default SmoothScroll;
