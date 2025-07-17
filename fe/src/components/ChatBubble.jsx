import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Button,
  Divider,
  Tooltip,
  Grow,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import aiApis from "../apis/ai.apis";
import { HttpStatusCode } from "axios";
import loading from "../assets/chatLoading.json";
import Lottie from "react-lottie";

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const responseTextRef = useRef("");
  const typingIntervalRef = useRef("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Chào bạn! Mình là trợ lý ảo Mkub, bạn cần hỗ trợ gì không?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    const userInput = input;
    setInput("");

    setMessages((prev) => [
      ...prev,
      userMessage,
      { from: "bot", text: "Đang xử lý..." },
    ]);

    const response = await aiApis.chatWithAI(userInput);

    if (response.status === HttpStatusCode.Ok) {
      const fullText = response.data.reply;
      let index = 0;
      responseTextRef.current = fullText;
      setDisplayedText("");

      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [...updated, { from: "bot", text: "" }];
      });

      typingIntervalRef.current = setInterval(() => {
        index++;
        const partial = fullText.slice(0, index);
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { from: "bot", text: partial };
          return updated;
        });

        if (index >= fullText.length) {
          clearInterval(typingIntervalRef.current);
        }
      }, 20);
    } else {
      setMessages((prev) => {
        const updated = [...prev];
        updated.pop();
        return [
          ...updated,
          {
            from: "bot",
            text: "Xin lỗi, có lỗi xảy ra khi xử lý câu hỏi. Vui lòng thử lại sau.",
          },
        ];
      });
    }
  };

  useEffect(() => {
    const full = responseTextRef.current;
    if (displayedText && displayedText.length === full.length) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { from: "bot", text: displayedText },
      ]);
    }
  }, [displayedText]);

  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
  }, []);

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
        <Grow in={open} timeout={500}>
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
                  {msg.text === "Đang xử lý..." ? (
                    <Lottie
                      options={{
                        loop: true,
                        autoplay: true,
                        animationData: loading,
                        rendererSettings: {
                          preserveAspectRatio: "xMidYMid slice",
                        },
                      }}
                      height={20}
                      width={20}
                    />
                  ) : (
                    <Typography sx={{ whiteSpace: "pre-line" }}>
                      {msg.text}
                    </Typography>
                  )}
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
        </Grow>
      )}
    </>
  );
};

export default ChatBubble;
