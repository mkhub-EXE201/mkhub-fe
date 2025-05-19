import React from "react";
import { Box, Typography } from "@mui/material";

const styles = {
    tabPanel: {
        boxShadow: 2,
        width: "100%",
        height: "100%",
        padding: 3,
    },
    tabTitle: { fontWeight: "600", fontSize: 16 }
};

function PersonalScheduleTab() {
    return (
        <Box sx={styles.tabPanel}>
            <Typography sx={styles.tabTitle}>
                Lịch cá nhân
            </Typography>
            <Typography>Lịch cá nhân...</Typography>
        </Box>
    );
}

export default PersonalScheduleTab;