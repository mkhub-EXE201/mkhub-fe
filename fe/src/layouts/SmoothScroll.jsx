import React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import PropTypes from 'prop-types';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const SmoothScroll = ({ children, enabled = true, strength = 1 }) => {
    const smootherContainerRef = useRef(null);
    const [smoothScroller, setSmoothScroller] = useState(null);
    const [isLowPerformanceDevice, setIsLowPerformanceDevice] = useState(false);

    // Check device performance on mount
    useEffect(() => {
        // Simple performance detection
        const checkPerformance = () => {
            // Check if the device is mobile or tablet
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // Check if browser supports DeviceMemory API
            const hasLowMemory =
                navigator.deviceMemory !== undefined && navigator.deviceMemory < 4;

            // Check if browser supports hardwareConcurrency API
            const hasLowCPU =
                navigator.hardwareConcurrency !== undefined &&
                navigator.hardwareConcurrency < 4;

            return isMobile || hasLowMemory || hasLowCPU;
        };

        setIsLowPerformanceDevice(checkPerformance());
    }, []);

    useEffect(() => {
        // Don't initialize smooth scrolling if disabled or on low-performance devices
        if (!enabled || isLowPerformanceDevice) return;

        // Use lighter settings for smoother performance
        const smoother = ScrollSmoother.create({
            wrapper: "#smooth-wrapper",
            content: "#smooth-content",
            smooth: strength, // Configurable strength
            effects: false, // Disable extra effects for better performance
            normalizeScroll: false, // Disable for better performance
            ignoreMobileResize: true, // Better mobile performance
        });

        setSmoothScroller(smoother);

        return () => {
            if (smoother) {
                smoother.kill();
            }
        };
    }, [enabled, strength, isLowPerformanceDevice]);

    // Local storage for user preference
    useEffect(() => {
        const savedPreference = localStorage.getItem('smoothScrollEnabled');
        if (savedPreference !== null) {
            const preferenceValue = savedPreference === 'true';
            if (!preferenceValue && smoothScroller) {
                smoothScroller.kill();
            }
        }
    }, [smoothScroller]);

    // If smooth scrolling is disabled or device is low performance, just render children
    if (!enabled || isLowPerformanceDevice) {
        return <>{children}</>;
    }

    return (
        <div id="smooth-wrapper" ref={smootherContainerRef}>
            <div id="smooth-content">
                {children}
            </div>
        </div>
    );
};

SmoothScroll.propTypes = {
    children: PropTypes.node.isRequired,
    enabled: PropTypes.bool,
    strength: PropTypes.number
};

export default SmoothScroll;
