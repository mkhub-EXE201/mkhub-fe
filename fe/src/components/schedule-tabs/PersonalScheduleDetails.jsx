import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Card, CardContent } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PropTypes from 'prop-types';


const styles = {
    card: {
        borderRadius: "18px",
        boxShadow: "0 3px 8px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s ease",
        minHeight: 200,
    },
    tabContainer: {
        width: "100%",
        marginTop: 10,
        display: "flex",
    },
    tabsRoot: {
        minWidth: "120px",
    },
    tab: {
        backgroundColor: "#F13067",
        color: "white",
        borderRadius: "20px 0 0 20px",
        minHeight: 60,
        // marginRight: 5,   
        marginLeft: 1,
        marginTop: 3.5,
        width: "95%",
        maxWidth: "95%",
        textTransform: "none",
        fontWeight: 600,
        alignItems: "flex-start",
        marginBottom: 0,
        position: "relative",
        transition: "all 0.3s",
        "&.Mui-selected": {
            backgroundColor: "#F13067",
            color: "white",
            borderLeft: "0px solid #FF69B4",
            backgroundImage: "linear-gradient(to right, rgba(255,105,180,0.3), rgba(255,105,180,0))",
            animation: "$glow 1.5s infinite ease-in-out",
            // boxShadow: "0 0 5px rgba(241, 48, 103, 0.7)",
        },
        "&:not(.Mui-selected)": {
            opacity: 0.6,
            filter: "brightness(1)",
            "&:hover": {
                transform: "scale(1.05)",
                opacity: 1,
            },
        },
    },

    "@keyframes glow": {
        "0%": { boxShadow: "0 0 5px rgba(241, 48, 103, 0.5)" },
        "50%": { boxShadow: "0 0 15px rgba(241, 48, 103, 0.8)" },
        "100%": { boxShadow: "0 0 5px rgba(241, 48, 103, 0.5)" },
    },
    tabPanel: { //content
        padding: 5,
        borderRadius: 8,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        minHeight: 300,
        maxWidth: 700,
        flexGrow: 1, // Allow panel to take remaining space
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        transition: "box-shadow 0.3s ease",
        // marginLeft: 0,
        "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
    },
    tabContent: {
        width: "100%",
    },
};

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={styles.tabPanel}>{children}</Box>}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function PersonalScheduleDetailsTabs() {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={styles.tabContainer}>
            <Tabs
                orientation="vertical"
                value={value}
                onChange={handleChange}
                aria-label="personal schedule details tabs"
                sx={{
                    ...styles.tabsRoot,
                    '& .MuiTabs-indicator': {
                        display: 'none',
                    }
                }}
            >
                <Tab label="Dịch vụ" sx={styles.tab} />
                <Tab label="Lịch hẹn" sx={styles.tab} />
                <Tab label="Ghi chú" sx={styles.tab} />
            </Tabs>
            <Box sx={styles.tabContent}>
                <TabPanel value={value} index={0}>
                    <Card sx={styles.card}>
                        <CardContent>
                            <Typography variant="h3" sx={{ fontSize: "1.2rem", fontWeight: "semi-bold", marginBottom: 1 }}>
                                Makeup thường ngày
                            </Typography>
                            <Typography>
                                Make up cổ điển theo style trong trẻo, phù hợp với Hàn Quốc.
                            </Typography>
                            <Typography>
                                Thiên về những tone hồng lớp nền căng mướt bóng mịn
                            </Typography>
                            <Typography>Đi kèm dịch vụ làm tóc cô dâu</Typography>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    textAlign: 'right',
                                    marginTop: 1
                                }}
                            >
                                Gói Cơ bản
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Card sx={styles.card}>
                        <CardContent>
                            <Typography variant="h4" sx={{ fontSize: "1.2rem", fontWeight: "semi-bold", marginBottom: 1 }}>Thứ 5, 20/03/2025</Typography>
                            <Typography variant="h4" sx={{ fontSize: "1.2rem", fontWeight: "semi-bold", marginBottom: 1 }}>5:00 PM</Typography>
                            <Typography>
                                <PlaceIcon sx={{ fontSize: 16, verticalAlign: "middle" }} /> Ho Chi Minh City
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Card sx={styles.card}>
                        <CardContent>
                            <Typography sx={{ fontSize: "1rem" }}>
                                Khách hàng da dầu vùng chữ T, yêu cầu layout makeup trong trẻo và nền căng bóng mịn
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
            </Box>
        </Box>
    );
}

export default PersonalScheduleDetailsTabs;