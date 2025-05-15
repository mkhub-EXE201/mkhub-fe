import React, { useState, useEffect } from "react";
import { Box, Skeleton, Tab, Tabs, Typography, useMediaQuery, Divider } from "@mui/material";
import PropTypes from "prop-types";
import theme from "../../theme/theme";
import avatar from "../../assets/artist-banner.jpg";
import ScheduleCalendar from "../../components/ScheduleCalendar";
import ScheduleCard from "../../components/ScheduleCard";
import FullCalendarComponent from "../../components/FullCalendar";
import { dateUtils } from "../../utils/common_utilities";

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
    contentContainer: { marginY: 4 },
    tabContent: { display: "flex", flexDirection: "column", gap: 3, marginTop: 3 },
    scheduleCardsContainer: (isLaptop) => ({
        boxShadow: 2,
        width: isLaptop ? "100%" : "50%",
        height: isLaptop ? "500px" : "100%",
        padding: 3,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
    }),
    cardsGrid: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: 3,
        flexGrow: 1,
        overflowY: "auto",
        paddingRight: 1,
        "&::-webkit-scrollbar": {
            width: "6px",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1",
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.ochre.lightGrey,
            borderRadius: "10px",
        },
    },
    calendarContainer: (isLaptop) => ({
        width: isLaptop ? "100%" : "50%",
        height: isLaptop ? "500px" : "100%",
    }),
    dailyViewContainer: (isLaptop) => ({
        display: "flex",
        flexDirection: isLaptop ? "column" : "row",
        gap: 3,
        height: isLaptop ? "auto" : "500px",
    }),
    tabPanel: {
        boxShadow: 2,
        width: "100%",
        height: "100%",
        padding: 3,
    },
    tabTitle: { fontWeight: "600", fontSize: 16 }
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
    const isLaptop = useMediaQuery('(max-width:1024px)');

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

    // Sample schedule data focused on May 15, 2025
    const scheduleData = [
        {
            id: 1,
            time: "9:00 AM",
            date: "T5, 15/05/2025",
            service: "Makeup hàng ngày concept nhẹ nhàng",
            fullDate: new Date(2025, 4, 15), // May 15, 2025
            avatar: avatar,
            location: "Bình Thạnh, Hồ Chí Minh"
        },
        {
            id: 2,
            time: "11:30 AM",
            date: "T5, 15/05/2025",
            service: "Makeup chụp ảnh quảng cáo",
            fullDate: new Date(2025, 4, 15), // May 15, 2025
            avatar: avatar,
            location: "Bình Thạnh, Hồ Chí Minh"
        },
        {
            id: 3,
            time: "2:00 PM",
            date: "T5, 15/05/2025",
            service: "Makeup sự kiện ra mắt sản phẩm",
            fullDate: new Date(2025, 4, 15), // May 15, 2025
            avatar: avatar,
            location: "Bình Thạnh, Hồ Chí Minh"
        },
        {
            id: 4,
            time: "5:30 PM",
            date: "T5, 15/05/2025",
            service: "Makeup dự tiệc cưới cao cấp",
            fullDate: new Date(2025, 4, 15), // May 15, 2025
            avatar: avatar,
            location: "Bình Thạnh, Hồ Chí Minh"
        },
    ];

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

    // Filter schedule data based on selected date
    const filteredSchedule = scheduleData.filter((item) =>
        dateUtils.isSameDay(item.fullDate, selectedDate)
    );

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
                    <Box sx={styles.tabContent}>
                        {/* Daily View: Schedule Cards and Calendar */}
                        <Box sx={styles.dailyViewContainer(isLaptop)}>
                            {/* Schedule Cards Section (LEFT SIDE) */}
                            <Box sx={styles.scheduleCardsContainer(isLaptop)}>
                                <Typography sx={{ fontWeight: "600", fontSize: 16, mb: 2 }}>
                                    Lịch hẹn - {dateUtils.formatDate(selectedDate)}
                                </Typography>

                                {filteredSchedule.length > 0 ? (
                                    <Box sx={styles.cardsGrid}>
                                        {filteredSchedule.map((appointment) => (
                                            <ScheduleCard
                                                key={appointment.id}
                                                appointment={appointment}
                                            />
                                        ))}
                                    </Box>
                                ) : (
                                    <Typography sx={{ marginTop: 2 }}>
                                        Không có lịch hẹn cho ngày này.
                                    </Typography>
                                )}
                            </Box>

                            {/* Calendar Section (RIGHT SIDE) */}
                            <Box sx={styles.calendarContainer(isLaptop)}>
                                <ScheduleCalendar
                                    selectedDate={selectedDate}
                                    handleDateChange={handleDateChange}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        {/* Weekly View: FullCalendar */}
                        <Box>
                            <FullCalendarComponent
                                events={calendarEvents}
                                selectedDate={selectedDate}
                                onAddEvent={handleAddEvent}
                            />
                        </Box>
                    </Box>
                </TabPanel>

                {/* Personal Schedule Tab */}
                <TabPanel value={activeTab} index={TABS.PERSONAL}>
                    <Box sx={styles.tabPanel}>
                        <Typography sx={styles.tabTitle}>
                            Lịch cá nhân
                        </Typography>
                        <Typography>Lịch cá nhân...</Typography>
                    </Box>
                </TabPanel>

                {/* Canceled Schedule Tab */}
                <TabPanel value={activeTab} index={TABS.CANCELED}>
                    <Box sx={styles.tabPanel}>
                        <Typography sx={styles.tabTitle}>
                            Lịch đã hủy
                        </Typography>
                        <Typography>Lịch đã huỷ...</Typography>
                    </Box>
                </TabPanel>
            </Box>
        </Box>
    );
}