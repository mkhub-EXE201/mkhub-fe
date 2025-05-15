import React, { useState, useEffect } from "react";
import { Box, Skeleton, Tab, Tabs, Typography, useMediaQuery } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import avatar from "../../assets/artist-banner.jpg";
import { format } from "date-fns";
import theme from "../../theme/theme";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function ArtistScheduleManagement() {
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 2, 7)); // Default to March 7, 2025
    const isLaptop = useMediaQuery('(max-width:1024px)');

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

    // Sample schedule data with dates matching the calendar (March 2025)
    const scheduleData = [
        {
            id: 1,
            time: "5:00 PM",
            date: "Thu, 5/03/2025",
            service: "Makeup hàng ngày concept nhẹ nhàng",
            fullDate: new Date(2025, 2, 5), // March 5, 2025
        },
        {
            id: 2,
            time: "5:00 PM",
            date: "Thu, 5/03/2025",
            service: "Makeup hàng ngày concept nhẹ nhàng",
            fullDate: new Date(2025, 2, 5), // March 5, 2025
        },
        {
            id: 3,
            time: "5:00 PM",
            date: "Thu, 5/03/2025",
            service: "Makeup hàng ngày concept nhẹ nhàng",
            fullDate: new Date(2025, 2, 5), // March 5, 2025
        },
        {
            id: 4,
            time: "7:30 PM",
            date: "Thu, 5/03/2025",
            service: "Makeup dự tiệc cưới cao cấp",
            fullDate: new Date(2025, 2, 5), // March 5, 2025
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
                            <Box sx={{
                                display: "flex",
                                flexDirection: isLaptop ? "column" : "row",
                                gap: 3,
                                marginTop: 3
                            }}>
                                {/* Schedule Cards Section (LEFT SIDE) */}
                                <Box
                                    sx={{
                                        boxShadow: 2,
                                        width: isLaptop ? "100%" : "50%",
                                        height: "100%",
                                        padding: 3,
                                        borderRadius: 2,
                                    }}
                                >
                                    <Typography sx={{ fontWeight: "600", fontSize: 16 }}>
                                        Lịch hẹn - {format(selectedDate, "dd/MM/yyyy")}
                                    </Typography>
                                    {filteredSchedule.length > 0 ? (
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "1fr",
                                                gap: 3,
                                                marginTop: 2,
                                                maxHeight: "450px",
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
                                            {filteredSchedule.map((item) => (
                                                <Box
                                                    key={item.id}
                                                    sx={{
                                                        border: "1px solid #ccc",
                                                        borderRadius: 2,
                                                        padding: 2,
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: 2,
                                                        boxShadow: 1,
                                                        backgroundColor: "#fff",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            alignItems: "center",
                                                            gap: 2,
                                                        }}
                                                    >
                                                        <img
                                                            src={avatar}
                                                            alt={`Artist ${item.id}`}
                                                            style={{
                                                                borderRadius: "50%",
                                                                width: 50,
                                                                height: 50,
                                                                objectFit: "cover",
                                                            }}
                                                        />
                                                        <Box>
                                                            <Typography fontWeight={500}>
                                                                Artist {item.id}
                                                            </Typography>
                                                            <Box
                                                                sx={{
                                                                    display: "flex",
                                                                    gap: "5px",
                                                                }}
                                                            >
                                                                <PlaceIcon sx={{ fontSize: 16 }} />
                                                                <Typography sx={{ fontSize: 13 }}>
                                                                    Bình Thạnh, Hồ Chí Minh
                                                                </Typography>
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                    <Typography sx={{ fontSize: 14 }}>
                                                        {item.service}
                                                    </Typography>
                                                    <Typography
                                                        sx={{ fontSize: 12, color: "#666" }}
                                                    >
                                                        {item.time} - {item.date}
                                                    </Typography>
                                                </Box>
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
                                        boxShadow: 2,
                                        borderRadius: 2,
                                        padding: 2,
                                        backgroundColor: "#fff",
                                        width: isLaptop ? "100%" : "50%",
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                                        <DateCalendar
                                            value={selectedDate}
                                            onChange={handleDateChange}
                                            views={["day"]}
                                            showDaysOutsideCurrentMonth
                                            displayWeekNumber={false}
                                            sx={{
                                                '& .MuiPickersDay-root.Mui-selected': {
                                                    backgroundColor: "#F13067 !important",
                                                    color: "#fff !important",
                                                    fontWeight: "bold",
                                                    '&:hover, &:focus': {
                                                        backgroundColor: "#F13067 !important",
                                                    },
                                                    '&:not(.Mui-selected)': {
                                                        borderColor: "#F13067",
                                                    },
                                                },
                                                "& .MuiPickersDay-today": {
                                                    border: "1px solid #ccc",
                                                },
                                                "& .MuiDayCalendar-header": {
                                                    color: theme.palette.primary.main,
                                                },
                                                "& .MuiPickersDay-root:hover": {
                                                    backgroundColor: theme.palette.lightPink,
                                                },
                                                "& .MuiPickersCalendarHeader-label": {
                                                    color: theme.palette.primary.main,
                                                    fontWeight: "bold",
                                                },
                                                // Calendar buttons
                                                "& .MuiButtonBase-root.MuiIconButton-root": {
                                                    color: theme.palette.primary.main,
                                                },
                                                "& .MuiPickersArrowSwitcher-root": {
                                                    color: theme.palette.primary.main,
                                                },
                                                maxWidth: "100%"
                                            }}
                                        />
                                    </LocalizationProvider>
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