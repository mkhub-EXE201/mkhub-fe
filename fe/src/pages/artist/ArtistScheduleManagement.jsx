import React, { useState, useEffect } from "react";
import { Box, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import PropTypes from "prop-types";
import theme from "../../theme/theme";
import avatar from "../../assets/artist-banner.jpg";
import GeneralScheduleTab from "../../components/schedule-tabs/GeneralScheduleTab";
import PersonalScheduleTab from "../../components/schedule-tabs/PersonalScheduleTab";
import CanceledScheduleTab from "../../components/schedule-tabs/CanceledScheduleTab";

// Constants
const TABS = {
    GENERAL: 0,
    PERSONAL: 1,
    CANCELED: 2
};

// Extracted styles for better maintenance
const styles = {
    container: { margin: 4 },
    title: { color: theme.palette.primary.main },
    loadingContainer: {
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "center",
        justifyContent: "center",
    },
    contentContainer: { marginY: 4 }
};

// Tab Panel component for better code organization
function TabPanel({ value, index, children }) {
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
function a11yProps(index) {
    return {
        id: `schedule-tab-${index}`,
        "aria-controls": `schedule-tabpanel-${index}`,
    };
}

export default function ArtistScheduleManagement() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(TABS.GENERAL);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 15)); // May 15, 2025

    // Sample calendar events data for FullCalendar
    const calendarEvents = [
        {
            id: '1',
            title: 'Lịch hẹn',
            start: new Date(2025, 4, 15, 10, 0).toISOString(),
            end: new Date(2025, 4, 15, 12, 0).toISOString(),
            color: '#F13067'
        },
        {
            id: '2',
            title: 'Lịch hẹn',
            start: new Date(2025, 4, 16, 13, 0).toISOString(),
            end: new Date(2025, 4, 16, 14, 30).toISOString(),
            color: '#F13067'
        },
        {
            id: '3',
            title: 'Lịch hẹn',
            start: '2025-05-17T09:00:00',
            end: '2025-05-17T11:00:00',
            color: '#F13067'
        }
    ];

    // Sample item data
    const scheduleItem = {
        id: 1,
        time: "9:00 AM",
        date: "T5, 15/05/2025",
        service: "Makeup hàng ngày concept nhẹ nhàng",
        fullDate: new Date(2025, 4, 15), // May 15, 2025
        avatar: avatar,
        location: "Bình Thạnh, Hồ Chí Minh"
    };

    // Create sample schedule with 4 identical items
    const scheduleData = Array(4).fill().map((_, index) => ({
        ...scheduleItem,
        id: index + 1
    }));

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Handle date change
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    // Handle add event click
    const handleAddEvent = () => {
        console.log("Add event clicked");
        // Implement event adding functionality
    };

    if (loading) {
        return (
            <Box sx={styles.container}>
                <Typography variant="h1" sx={styles.title}>
                    Quản lý lịch hẹn
                </Typography>
                <Box sx={styles.loadingContainer}>
                    <Skeleton variant="circular" width={100} height={100} />
                    <Skeleton variant="rectangular" width={310} height={60} />
                    <Skeleton variant="rounded" width={310} height={60} />
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={styles.container}>
            <Typography variant="h1" sx={styles.title}>
                Quản lý lịch hẹn
            </Typography>

            <Box sx={styles.contentContainer}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    aria-label="schedule tabs"
                >
                    <Tab label="Lịch trình chung" {...a11yProps(TABS.GENERAL)} />
                    <Tab label="Lịch trình cá nhân" {...a11yProps(TABS.PERSONAL)} />
                    <Tab label="Đã hủy" {...a11yProps(TABS.CANCELED)} />
                </Tabs>

                {/* General Schedule Tab */}
                <TabPanel value={activeTab} index={TABS.GENERAL}>
                    <GeneralScheduleTab
                        selectedDate={selectedDate}
                        handleDateChange={handleDateChange}
                        scheduleData={scheduleData}
                        calendarEvents={calendarEvents}
                        onAddEvent={handleAddEvent}
                    />
                </TabPanel>

                {/* Personal Schedule Tab */}
                <TabPanel value={activeTab} index={TABS.PERSONAL}>
                    <PersonalScheduleTab />
                </TabPanel>

                {/* Canceled Schedule Tab */}
                <TabPanel value={activeTab} index={TABS.CANCELED}>
                    <CanceledScheduleTab />
                </TabPanel>
            </Box>
        </Box>
    );
}