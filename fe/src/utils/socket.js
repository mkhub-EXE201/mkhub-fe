// utils/socket.js
import { io } from "socket.io-client";

export default function createSocket(userId, role) {
  console.log(userId, role);
  const socket = io(import.meta.env.VITE_API_BASE_URL, {
    transports: ["websocket"],
    withCredentials: true,
    auth: {
      userId,
      role,
    },
  });

  socket.on("connect", () => {
    console.log("Connected to socket:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket");
  });

  return socket;
}
