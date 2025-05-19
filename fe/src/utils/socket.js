import { useContext } from "react";
import { io } from "socket.io-client";
import { AppContext } from "../contexts/app.context";
const { profile } = useContext(AppContext);
export const socket = io("https://mkhub-be.onrender.com", {
  transports: ["websocket"],
  withCredentials: true,
  query: {
    userId: profile.id,
  },
});
socket.on("connect", () => {
  console.log("✅ Connected to socket:", socket.id);
});

socket.on("NOTIFICATION", (noti) => {
  console.log("📥 Notification received:", noti);
});

socket.on("disconnect", () => {
  console.log("❌ Disconnected from socket");
});
