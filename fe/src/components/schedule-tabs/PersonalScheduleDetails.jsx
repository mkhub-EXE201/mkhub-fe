import React, { useState } from "react";
import { Box, Tabs, Tab, Typography, Card, CardContent } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PropTypes from 'prop-types';

const styles = {
    tabContainer: {
        width: "100%",
        marginTop: 3,
    },
    tab: {
        backgroundColor: "#F13067",
        color: "white",
        borderRadius: "4px 4px 0 0",
        padding: "8px 16px",
        minWidth: 100,
        textTransform: "none",
        fontWeight: 600,
        "&.Mui-selected": {
            backgroundColor: "#F13067",
            color: "white",
            transform: "translateY(-4px)", // Peek effect when selected
            boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
        },
        "&:not(.Mui-selected)": {
            transition: "transform 0.3s",
        },
    },
    tabPanel: {
        padding: 2,
        borderRadius: 2,
        border: "1px solid #ccc",
        backgroundColor: "#fff",
    },
    blueBorder: {
        border: "2px solid #007BFF",
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
            <Tabs value={value} onChange={handleChange} aria-label="personal schedule details tabs">
                <Tab label="Dịch vụ" sx={styles.tab} />
                <Tab label="Lịch hẹn" sx={styles.tab} />
                <Tab label="Ghi chú" sx={styles.tab} />
            </Tabs>
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
    );
}

export default PersonalScheduleDetailsTabs;