import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

// Common styles extracted for better maintenance
const styles = {
    card: {
        border: "1px solid #ccc",
        borderRadius: 2,
        padding: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
        backgroundColor: "#fff",
    },
    profileContainer: {
        display: "flex",
        alignItems: "center",
        gap: 2,
    },
    avatar: {
        borderRadius: "50%",
        width: 50,
        height: 50,
        objectFit: "cover",
    },
    locationContainer: {
        display: "flex",
        gap: "5px",
    },
    service: {
        fontSize: 14
    },
    dateTime: {
        fontSize: 12,
        color: "#666"
    }
};

const ScheduleCard = ({ appointment }) => {
    const {
        id,
        avatar,
        artistName,
        location,
        service,
        time,
        date
    } = appointment;

    return (
        <Box sx={styles.card}>
            <Box sx={styles.profileContainer}>
                <img
                    src={avatar}
                    alt={`Khach Hang ${id}`}
                    style={styles.avatar}
                />
                <Box>
                    <Typography fontWeight={500}>
                        {artistName || `Khach ${id}`}
                    </Typography>
                    <Box sx={styles.locationContainer}>
                        <PlaceIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: 13 }}>
                            {location || "Bình Thạnh, Hồ Chí Minh"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Typography sx={styles.service}>{service}</Typography>
            <Typography sx={styles.dateTime}>
                {time} - {date}
            </Typography>
        </Box>
    );
};

ScheduleCard.propTypes = {
    appointment: PropTypes.shape({
        id: PropTypes.number.isRequired,
        time: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        service: PropTypes.string.isRequired,
        avatar: PropTypes.string,
        artistName: PropTypes.string,
        location: PropTypes.string,
    }).isRequired,
};

export default ScheduleCard;