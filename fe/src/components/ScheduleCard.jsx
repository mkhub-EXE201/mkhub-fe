import React from "react";
import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";

const ScheduleCard = ({ appointment }) => {
    return (
        <Box
            sx={{
                border: "1px solid #ccc",
                borderRadius: 2,
                padding: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
                boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.15)",
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
                    src={appointment.avatar}
                    alt={`Artist ${appointment.id}`}
                    style={{
                        borderRadius: "50%",
                        width: 50,
                        height: 50,
                        objectFit: "cover",
                    }}
                />
                <Box>
                    <Typography fontWeight={500}>
                        {appointment.artistName || `Artist ${appointment.id}`}
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            gap: "5px",
                        }}
                    >
                        <PlaceIcon sx={{ fontSize: 16 }} />
                        <Typography sx={{ fontSize: 13 }}>
                            {appointment.location || "Bình Thạnh, Hồ Chí Minh"}
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Typography sx={{ fontSize: 14 }}>
                {appointment.service}
            </Typography>
            <Typography
                sx={{ fontSize: 12, color: "#666" }}
            >
                {appointment.time} - {appointment.date}
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