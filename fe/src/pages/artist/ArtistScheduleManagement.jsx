import React, { useState, useEffect } from "react";
import { Box, Skeleton, Tab, Tabs, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import avatar from "../../assets/profile.svg";

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        "aria-controls": `simple-tabpanel-${index}`,
    };
}

export default function ArtistScheduleManagement() {
    const [loading, setLoading] = useState(true);
    const [value, setValue] = useState(0);

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

    const scheduleData = [
        { id: 1, time: "5:00 PM", date: "Thu, 5/03/2025", service: "Makeup hàng ngày concept nhẹ nhàng" },
        { id: 2, time: "5:00 PM", date: "Thu, 5/03/2025", service: "Makeup hàng ngày concept nhẹ nhàng" },
        { id: 3, time: "5:00 PM", date: "Thu, 5/03/2025", service: "Makeup hàng ngày concept nhẹ nhàng" },
    ];

    return (
        <Box sx={{ margin: 4 }}>
            <Typography
                variant="h1"
                sx={{ color: (theme) => theme.palette.primary.main }}
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
                            <Box
                                sx={{
                                    boxShadow: 2,
                                    width: "70%",
                                    height: "100%",
                                    padding: 3,
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", fontSize: 16 }}>
                                    Lịch hẹn
                                </Typography>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(3, 1fr)",
                                        gap: 3,
                                        marginTop: 2,
                                    }}
                                >
                                    {scheduleData.map((item) => (
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
                                                    style={{ borderRadius: "50%", width: 60, height: 60 }}
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
                                            <Typography sx={{ fontSize: 12, color: "#666" }}>
                                                {item.time} - {item.date}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                        {value === 1 && (
                            <Box
                                sx={{
                                    boxShadow: 2,
                                    width: "70%",
                                    height: "100%",
                                    padding: 3,
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", fontSize: 16 }}>
                                    Lịch cá nhân
                                </Typography>
                                {/* Add personal schedule content here */}
                                <Typography>Personal schedule content goes here.</Typography>
                            </Box>
                        )}
                        {value === 2 && (
                            <Box
                                sx={{
                                    boxShadow: 2,
                                    width: "70%",
                                    height: "100%",
                                    padding: 3,
                                }}
                            >
                                <Typography sx={{ fontWeight: "600", fontSize: 16 }}>
                                    Lịch đã hủy
                                </Typography>
                                {/* Add canceled schedule content here */}
                                <Typography>Canceled schedule content goes here.</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </Box>
    );
}