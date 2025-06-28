/* eslint-disable react/prop-types */
import React from "react";
import { Box, Typography } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import PropTypes from "prop-types";

const defaultStyles = {
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
    backgroundColor: "#fff",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  },
};

function CustomProfileCard({
  isHome,
  customerData,
  width,
  height,
  avatarSize = 60,
  nameTextSize = 16,
  locationTextSize = 13,
  buttonTextSize = 14,
  buttonSize = "medium", // New prop for button size
  customStyles = {},
  buttonText = "Liên hệ",
  onButtonClick,
  renderAvatar,
  renderContent,
  renderButton,
  className,
  wardName,
  districtName,
  provinceName,
}) {
  // Define button padding based on buttonSize prop
  const getButtonPadding = () => {
    switch (buttonSize) {
      case "small":
        return "4px 8px";
      case "large":
        return "12px 24px";
      case "medium":
      default:
        return "8px 16px"; // Default padding from original
    }
  };

  return (
    <Box
      className={className}
      sx={{
        ...defaultStyles.customerInfo,
        ...customStyles.customerInfo,
        width: width || "100%",
        height: height || "auto",
      }}
    >
      <Box
        sx={{
          ...defaultStyles.profileContainer,
          ...customStyles.profileContainer,
        }}
      >
        {renderAvatar ? (
          renderAvatar(customerData)
        ) : (
          <img
            src={isHome ? customerData.avatar : customerData.client.avatar_url}
            alt={customerData.name}
            style={{
              ...defaultStyles.avatar,
              ...customStyles.avatar,
              width: avatarSize,
              height: avatarSize,
            }}
          />
        )}
        {renderContent ? (
          renderContent(customerData)
        ) : (
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontWeight: 500,
                fontSize: nameTextSize,
                ...customStyles.nameText,
              }}
            >
              {isHome
                ? customerData.name
                : customerData.client.last_name +
                  " " +
                  customerData.client.first_name}
            </Typography>
            <Box
              sx={{
                ...defaultStyles.locationContainer,
                ...customStyles.locationContainer,
              }}
            >
              <PlaceIcon
                sx={{
                  fontSize: locationTextSize,
                  color: "#666",
                  ...customStyles.locationIcon,
                }}
              />
              <Typography
                sx={{
                  fontSize: locationTextSize,
                  color: "#666",
                  ...customStyles.locationText,
                }}
              >
                {isHome
                  ? customerData.location
                  : `${customerData.street_name}, ${wardName}, ${districtName}, ${provinceName}`}
              </Typography>
            </Box>
          </Box>
        )}
        {renderButton ? (
          renderButton(customerData)
        ) : (
          <Box
            sx={{
              ...defaultStyles.contactButton,
              ...customStyles.contactButton,
              padding: getButtonPadding(), // Apply dynamic padding
            }}
            onClick={() => onButtonClick && onButtonClick(customerData)}
          >
            <Typography
              sx={{
                fontSize: buttonTextSize,
                ...customStyles.buttonText,
              }}
            >
              {buttonText}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}

// Add PropTypes validation
CustomProfileCard.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  avatarSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  nameTextSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  locationTextSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buttonTextSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buttonSize: PropTypes.oneOf(["small", "medium", "large"]), // New prop type
  customStyles: PropTypes.shape({
    customerInfo: PropTypes.object,
    profileContainer: PropTypes.object,
    avatar: PropTypes.object,
    nameText: PropTypes.object,
    locationContainer: PropTypes.object,
    locationIcon: PropTypes.object,
    locationText: PropTypes.object,
    contactButton: PropTypes.object,
    buttonText: PropTypes.object,
  }),
  buttonText: PropTypes.string,
  onButtonClick: PropTypes.func,
  renderAvatar: PropTypes.func,
  renderContent: PropTypes.func,
  renderButton: PropTypes.func,
  className: PropTypes.string,
};

// Add default props
CustomProfileCard.defaultProps = {
  customerData: {
    id: 0,
    name: "Guest User",
    avatar: "",
    location: "Unknown location",
  },
  width: "100%",
  height: "auto",
  avatarSize: 60,
  nameTextSize: 16,
  locationTextSize: 13,
  buttonTextSize: 14,
  buttonSize: "medium", // Default button size
  customStyles: {},
  buttonText: "Liên hệ",
  onButtonClick: null,
  renderAvatar: null,
  renderContent: null,
  renderButton: null,
  className: "",
};

export default CustomProfileCard;
