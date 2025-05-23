import React from "react";
import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PropTypes from "prop-types";

const styles = {
    customerInfo: {
        border: "1px solid #ccc",
        borderRadius: 4,
        padding: 3,
        marginBottom: 3,
        backgroundColor: "#fff",
    },
    profileContainer: {
        display: "flex",
        alignItems: "center",
        gap: 2,
        marginBottom: 2,
    },
    avatar: {
        borderRadius: "50%",
        width: 60,
        height: 60,
        objectFit: "cover",
    },
    locationContainer: {
        display: "flex",
        alignItems: "center",
        gap: 1,
        marginTop: 1,
    },
    contactButton: {
        border: "1px solid #ddd",
        borderRadius: 2,
        padding: "8px 16px",
        backgroundColor: "#fff",
        cursor: "pointer",
        "&:hover": {
            backgroundColor: "#f5f5f5",
        },
    },
};

function CustomProfileCard({ customerData }) {
    return (
        <Box sx={styles.customerInfo}>
            <Box sx={styles.profileContainer}>
                <img
                    src={customerData.avatar}
                    alt={customerData.name}
                    style={styles.avatar}
                />
                <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 500, fontSize: 16 }}>
                        {customerData.name}
                    </Typography>
                    <Box sx={styles.locationContainer}>
                        <PlaceIcon sx={{ fontSize: 16, color: "#666" }} />
                        <Typography sx={{ fontSize: 13, color: "#666" }}>
                            {customerData.location}
                        </Typography>
                    </Box>
                </Box>
                <Box sx={styles.contactButton}>
                    <Typography sx={{ fontSize: 14 }}>
                        Liên hệ
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
}

// Add PropTypes validation
CustomProfileCard.propTypes = {
    customerData: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
        avatar: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        location: PropTypes.string.isRequired,
        phone: PropTypes.string,
        email: PropTypes.string,
        appointmentDate: PropTypes.instanceOf(Date),
        service: PropTypes.string,
        time: PropTypes.string
    }).isRequired
};

// Add default props
CustomProfileCard.defaultProps = {
    customerData: {
        id: 0,
        name: "Guest User",
        avatar: "",
        location: "Unknown location"
    }
};

export default CustomProfileCard;