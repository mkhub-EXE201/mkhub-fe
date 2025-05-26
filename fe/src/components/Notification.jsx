/* eslint-disable react/prop-types */
import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { IconButton, Badge, Popover, Typography, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { USER_ROLE } from "../constants/enum";

export default function Notification({
  notifications,
  getNotificationsByStatus,
  isScrolled,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("Tất cả");

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  const handleSwitchStatus = (label) => {
    setSelectedFilter(label);
    if (label === "Tất cả") {
      getNotificationsByStatus(USER_ROLE.MEMBER);
    } else {
      getNotificationsByStatus(USER_ROLE.MEMBER, false);
    }
  };
  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        sx={{ position: "relative" }}
      >
        <Badge badgeContent={notifications?.length ?? 0} color="error">
          <NotificationsIcon sx={{ color: isScrolled ? "black" : "white", width: isScrolled ? 25 : 30, height: isScrolled ? 25 : 30 }} />
        </Badge>
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 400 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Thông báo
          </Typography>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {["Tất cả", "Chưa đọc"].map((label, idx) => (
              <Box
                key={idx}
                onClick={() => handleSwitchStatus(label)}
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: 20,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  bgcolor:
                    selectedFilter === label ? "primary.main" : "grey.100",
                  color:
                    selectedFilter === label ? "common.white" : "text.primary",
                  "&:hover": {
                    bgcolor:
                      selectedFilter === label ? "primary.dark" : "grey.200",
                  },
                }}
              >
                {label}
              </Box>
            ))}
          </Box>

          {notifications && notifications.length > 0 ? (
            notifications.map((item, index) => (
              <Box
                key={index}
                sx={{
                  p: 1.5,
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 1,
                  position: "relative",
                }}
              >
                {!item.isRead && (
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      bgcolor: "primary.main",
                      borderRadius: "50%",
                      mt: 0.7,
                    }}
                  />
                )}

                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body2">{item.message}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(item.created_at).toLocaleString("vi-VN")}
                    </Typography>
                  </Box>

                  <IconButton size="small">
                    <MoreVertIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Không có thông báo mới
            </Typography>
          )}
        </Box>
      </Popover>
    </>
  );
}
