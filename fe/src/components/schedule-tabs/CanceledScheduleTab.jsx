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

function CanceledScheduleTab() {
    return (
        <Box sx={styles.tabPanel}>
            <Typography sx={styles.tabTitle}>
                Lịch đã hủy
            </Typography>
            <Typography>Lịch đã huỷ...</Typography>
        </Box>
    );
}

export default CanceledScheduleTab;