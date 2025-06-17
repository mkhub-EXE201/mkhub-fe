/* eslint-disable react/prop-types */
import { Box, TextField, IconButton, Typography, Avatar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState } from "react";
import chatLineApis from "../apis/chatLines.apis";
import { MESSAGE_SENDER_TYPE } from "../constants/enum";
import HttpStatusCode from "../constants/httpStatus";
import chatRoomApis from "../apis/chatRooms.apis";

const ChatBox = ({ onClose, artist, client }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatRoom, setChatRoom] = useState({});

  const getChatHistory = async () => {
    const response = await chatRoomApis.getChatHistory({
      client_id: client.id,
      artist_id: artist.id,
    });
    if (response.status === HttpStatusCode.Ok) {
      setChatRoom(response.data.result);
      setMessages(response.data.result.ChatLine);
    }
  };

  useEffect(() => {
    getChatHistory();
  }, []);

  const handleSend = async () => {
    if (!message.trim()) return;
    const payload = {
      artist_id: artist.id,
      client_id: client.id,
      message,
      sender_type: MESSAGE_SENDER_TYPE.CLIENT,
    };
    if (chatRoom?.id) {
      payload.chat_room_id = chatRoom.id;
    }
    const response = await chatLineApis.sendMessage(payload);
    if (response.status === HttpStatusCode.Ok) {
      getChatHistory();
      setMessage("");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 50,
        width: 320,
        zIndex: 100,
        height: 400,
        bgcolor: "#fff",
        boxShadow: 4,
        borderRadius: 2,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 1,
          bgcolor: (theme) => theme.palette.darkPink,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Avatar
            src={artist.avatar_url}
            sx={{
              width: 40,
              aspectRatio: "1/1",
              objectFit: "cover",
              borderRadius: "50%",
              flexShrink: 0,
            }}
            alt="Artist Avatar"
          />
          <Typography>{artist.name}</Typography>
        </Box>
        <IconButton size="small" onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((msg, index) => {
          const isClient = msg.sender_type === MESSAGE_SENDER_TYPE.CLIENT;

          return (
            <Box
              key={index}
              sx={{
                alignSelf: isClient ? "flex-end" : "flex-start",
                bgcolor: isClient ? "primary.light" : "grey.200",
                color: "white",
                p: 1,
                borderRadius: 2,
                maxWidth: "80%",
              }}
            >
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ p: 1, display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Nhập tin nhắn..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatBox;
