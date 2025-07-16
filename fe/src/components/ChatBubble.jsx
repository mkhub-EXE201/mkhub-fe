import React, { useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Button,
  Divider,
  Tooltip,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Chào bạn! Mình là trợ lý ảo Mkub, bạn cần hỗ trợ gì không?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Giả lập phản hồi từ AI
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "user", text: input },
        { from: "bot", text: "Cảm ơn bạn đã nhắn! Mình sẽ phản hồi sớm." },
      ]);
    }, 800);
  };

  return (
    <>
      {/* Bubble Icon */}
      {!open && (
        <Tooltip title={"Hỗ trợ từ Mkub AI"}>
          <IconButton
            color="primary"
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 1300,
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
            onClick={() => setOpen(true)}
          >
            <ChatIcon />
          </IconButton>
        </Tooltip>
      )}

      {/* Chat Window */}
      {open && (
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 360,
            height: 500,
            zIndex: 1300,
            display: "flex",
            borderRadius: 2,
            flexDirection: "column",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              bgcolor: "primary.main",
              color: "white",
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <img
                src="https://i.pinimg.com/1200x/13/13/bb/1313bb3c2083580c7b791508c50ee885.jpg"
                width={40}
                height={40}
                style={{
                  objectFit: "cover",
                  aspectRatio: "1/1",
                  borderRadius: "10%",
                }}
              />
              <Typography variant="subtitle1">Trợ lý ảo Mkub</Typography>
            </Box>
            <IconButton
              size="small"
              sx={{ color: "white" }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />

          {/* Chat area */}
          <Box
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
              bgcolor: "#f5f5f5",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  alignSelf: msg.from === "user" ? "flex-end" : "flex-start",
                  bgcolor: msg.from === "user" ? "primary.light" : "#e0e0e0",
                  p: 1.2,
                  borderRadius: 2,
                  maxWidth: "80%",
                }}
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
          </Box>

          {/* Input */}
          <Box
            sx={{
              p: 1.5,
              display: "flex",
              gap: 1,
              borderTop: "1px solid #ddd",
            }}
          >
            <TextField
              size="small"
              variant="outlined"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="Bạn cần giúp gì?"
            />
            <Button variant="contained" onClick={handleSend}>
              Gửi
            </Button>
          </Box>
        </Paper>
      )}
    </>
  );
};

export default ChatBubble;
