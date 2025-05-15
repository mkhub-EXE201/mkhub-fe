import React, { useState, useEffect } from "react";
import { Box, Skeleton, Tab, Tabs, Typography, useMediaQuery, Divider } from "@mui/material";
import { format } from "date-fns";
import avatar from "../../assets/artist-banner.jpg";
import theme from "../../theme/theme";
import ScheduleCalendar from "../../components/ScheduleCalendar";
import ScheduleCard from "../../components/ScheduleCard";
import FullCalendarComponent from "../../components/FullCalendar";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function ArtistScheduleManagement() {
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 4, 15)); // Default to May 15, 2025 (current date)
    const isLaptop = useMediaQuery('(max-width:1024px)');

    // Sample calendar events data for FullCalendar
    const calendarEvents = [
        {
            id: '1',
            title: 'Makeup client A',
            start: '2025-05-15T10:00:00',
            end: '2025-05-15T12:00:00',
            color: '#F13067'
        },
        {
            id: '2',
            title: 'Photo shoot session',
            start: '2025-05-16T13:00:00',
            end: '2025-05-16T14:30:00',
            color: '#F13067'
        },
        {
            id: '3',
            title: 'Wedding makeup',
            start: '2025-05-17T09:00:00',
            end: '2025-05-17T11:00:00',
            color: '#F13067'
        }
    ];

    // Handle add event click
    const handleAddEvent = () => {
        console.log("Add event clicked");
        // Implement event adding functionality
    };

    useEffect(() => {
        // Simulate API call
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
    };

    // Sample schedule data with appointments focused on May 15, 2025
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

    // Filter schedule data based on selected date
    const filteredSchedule = scheduleData.filter((item) => {
        return (
            item.fullDate.getDate() === selectedDate.getDate() &&
            item.fullDate.getMonth() === selectedDate.getMonth() &&
            item.fullDate.getFullYear() === selectedDate.getFullYear()
        );
    });

    return (
        <Box sx={{ margin: 4 }}>
            <Typography
                variant="h1"
                sx={{ color: theme.palette.primary.main }}
            >
                Quản lý lịch hẹn
            </Typography>
            <Box>
                {loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Skeleton variant="circular" width={100} height={100} />
                        <Skeleton variant="rectangular" width={310} height={60} />
                        <Skeleton variant="rounded" width={310} height={60} />
                    </Box>
                ) : (
                    <Box sx={{ marginY: 4 }}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            aria-label="schedule tabs example"
                        >
                            <Tab label="Lịch trình chung" {...a11yProps(0)} />
                            <Tab label="Lịch trình cá nhân" {...a11yProps(1)} />
                            <Tab label="Đã hủy" {...a11yProps(2)} />
                        </Tabs>
                        {value === 0 && (
                            <Box sx={{ display: "flex", flexDirection: "column", gap: 3, marginTop: 3 }}>
                                {/* Daily View: Schedule Cards and Calendar */}
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: isLaptop ? "column" : "row",
                                        gap: 3,
                                        height: isLaptop ? "auto" : "500px",
                                    }}
                                >
                                    {/* Schedule Cards Section (LEFT SIDE) */}
                                    <Box
                                        sx={{
                                            boxShadow: 2,
                                            width: isLaptop ? "100%" : "50%",
                                            height: isLaptop ? "500px" : "100%",
                                            padding: 3,
                                            borderRadius: 2,
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Typography sx={{ fontWeight: "600", fontSize: 16, mb: 2 }}>
                                            Lịch hẹn - {format(selectedDate, "dd/MM/yyyy")}
                                        </Typography>
                                        {filteredSchedule.length > 0 ? (
                                            <Box
                                                sx={{
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
                                                }}
                                            >
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
                                    <Box
                                        sx={{
                                            width: isLaptop ? "100%" : "50%",
                                            height: isLaptop ? "500px" : "100%",
                                        }}
                                    >
                                        <ScheduleCalendar
                                            selectedDate={selectedDate}
                                            handleDateChange={handleDateChange}
                                        />
                                    </Box>
                                </Box>

                                {/* Divider */}
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
                        )}
                        {value === 1 && (
                            <Box
                                sx={{
                                    boxShadow: 2,
                                    width: "100%",
                                    height: "100%",
                                    padding: 3,
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", fontSize: 16 }}>
                                    Lịch cá nhân
                                </Typography>
                                {/* Add personal schedule content here */}
                                <Typography>Lịch cá nhân...</Typography>
                            </Box>
                        )}
                        {value === 2 && (
                            <Box
                                sx={{
                                    boxShadow: 2,
                                    width: "100%",
                                    height: "100%",
                                    padding: 3,
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", fontSize: 16 }}>
                                    Lịch đã hủy
                                </Typography>
                                {/* Add canceled schedule content here */}
                                <Typography> Lịch đã huỷ... </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}