import React from "react";
import PropTypes from "prop-types";

export function TabPanel({ value, index, children }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`schedule-tabpanel-${index}`}
            aria-labelledby={`schedule-tab-${index}`}
        >
            {value === index && children}
        </div>
    );
}

// Add PropTypes validation for TabPanel
TabPanel.propTypes = {
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    children: PropTypes.node,
};

// Tab a11y props helper
export function a11yProps(index) {
    return {
        id: `schedule-tab-${index}`,
        "aria-controls": `schedule-tabpanel-${index}`,
    };
}