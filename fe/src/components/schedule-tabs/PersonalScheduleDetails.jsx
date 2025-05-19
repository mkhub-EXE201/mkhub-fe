import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Card, CardContent } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PropTypes from 'prop-types';

const styles = {
    tabContainer: {
        width: "100%",

        marginTop: 3,
        display: "flex", 
    },
    tabsRoot: {
        borderRight: "1px solid #ccc",
        minWidth: "120px",
    },
    tab: {
        backgroundColor: "#F13067",
        color: "white",
        borderRadius: "20px 0 0 20px",
        minHeight: 60,
        // marginRight: 5,   
        marginLeft: 1,
        width: "95%", 
        maxWidth: "95%",
        textTransform: "none",
        fontWeight: 600,
        alignItems: "flex-start",
        marginBottom: 1.5,
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
                transform: "scale(1.02)",
                opacity: 1,
            },
        },
    },
    // Define the glow animation
    "@keyframes glow": {
        "0%": { boxShadow: "0 0 5px rgba(241, 48, 103, 0.5)" },
        "50%": { boxShadow: "0 0 15px rgba(241, 48, 103, 0.8)" },
        "100%": { boxShadow: "0 0 5px rgba(241, 48, 103, 0.5)" },
    },
    tabPanel: { //content
        padding: 2,
        borderRadius: 8,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
        minHeight: 300,
        flexGrow: 1, // Allow panel to take remaining space
        marginLeft: 1, // Add spacing between tabs and panel
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
                sx={styles.tabsRoot}
            >
                <Tab label="Dịch vụ" sx={styles.tab} />
                <Tab label="Lịch hẹn" sx={styles.tab} />
                <Tab label="Ghi chú" sx={styles.tab} />
            </Tabs>
            <Box sx={styles.tabContent}>
                <TabPanel value={value} index={0}>
                    <Card>
                        <CardContent>
                            <Typography>Makeup thường ngày</Typography>
                            <Typography>
                                Make up cổ điển theo style trong trẻo, phù hợp với Hàn Quốc.
                            </Typography>
                            <Typography>
                                Thiện về nhấn tone hồng lọp nhẹ, làm mượt bọng mặt
                            </Typography>
                            <Typography>Di kèm dịch vụ làm tóc cổ điển</Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={1}>
                    <Card sx={styles.blueBorder}>
                        <CardContent>
                            <Typography>Thứ 5, 20/03/2025</Typography>
                            <Typography>5:00 PM</Typography>
                            <Typography>
                                <PlaceIcon sx={{ fontSize: 16, verticalAlign: "middle" }} /> Ho Chi Minh City
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={2}>
                    <Card>
                        <CardContent>
                            <Typography>
                                Khách hàng đã yêu cầu T, yêu cầu layout makeup trong trẻo và nền căng bóng mịn
                            </Typography>
                        </CardContent>
                    </Card>
                </TabPanel>
            </Box>
        </Box>
    );
}

export default PersonalScheduleDetailsTabs;