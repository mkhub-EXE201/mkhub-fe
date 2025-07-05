/* eslint-disable react/prop-types */
import React from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Divider,
} from "@mui/material";

export default function ChatSideBar({
  isClient,
  chatRooms,
  selectedRoom,
  onSelect,
}) {
  return (
    <Box
      sx={{
        width: 300,
        height: "100%",
        borderRight: "1px solid #e0e0e0",
        overflowY: "auto",
      }}
    >
      <List disablePadding>
        {chatRooms.map((room) => {
          const lastMessage =
            room.ChatLine?.[room.ChatLine.length - 1]?.message || "";
          const isSelected = selectedRoom?.id === room.id;

          return (
            <ListItemButton
              key={room.id}
              selected={isSelected}
              onClick={() => onSelect(room)}
              sx={{
                alignItems: "flex-start",
                px: 2,
                py: 1.5,
                bgcolor: isSelected ? "primary.light" : "transparent",
                "&:hover": {
                  bgcolor: "primary.lighter",
                },
              }}
            >
              <ListItemAvatar>
                <Avatar
                  src={
                    isClient ? room.artist?.avatar_url : room.client?.avatar_url
                  }
                  sx={{ width: 48, height: 48 }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" fontWeight="medium">
                    {isClient
                      ? `${room.artist?.name}`
                      : `${room.client?.last_name} ${room.client?.first_name}`}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    noWrap
                    maxWidth="200px"
                  >
                    {lastMessage}
                  </Typography>
                }
              />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
