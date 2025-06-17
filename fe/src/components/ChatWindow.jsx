/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import chatLineApis from "../apis/chatLines.apis";
import { HttpStatusCode } from "axios";
import { MESSAGE_SENDER_TYPE } from "../constants/enum";

export default function ChatWindow({ room }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (room) {
      setMessages(room.ChatLine || []);
    }
  }, [room]);

  const handleSend = async () => {
    if (!message.trim()) return;

    const payload = {
      chat_room_id: room.id,
      artist_id: room.artist_id,
      client_id: room.client_id,
      message,
      sender_type: MESSAGE_SENDER_TYPE.ARTIST,
    };

    const res = await chatLineApis.sendMessage(payload);
    if (res.status === HttpStatusCode.Ok) {
      setMessages((prev) => [...prev, payload]);
      setMessage("");
    }
  };

  if (!room) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>Chọn cuộc trò chuyện để bắt đầu</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
        <Typography variant="h6">
          {room.client?.last_name} {room.client?.first_name}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {messages.map((msg, index) => {
          const isArtist = msg.sender_type === MESSAGE_SENDER_TYPE.ARTIST;
          return (
            <Box
              key={index}
              sx={{
                alignSelf: isArtist ? "flex-end" : "flex-start",
                bgcolor: isArtist ? "primary.light" : "grey.300",
                p: 1,
                borderRadius: 2,
                maxWidth: "70%",
                color: isArtist ? "white" : "black",
              }}
            >
              <Typography variant="body2">{msg.message}</Typography>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ p: 2, display: "flex", gap: 1 }}>
        <TextField
          fullWidth
          size="small"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập tin nhắn..."
        />
        <IconButton onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
