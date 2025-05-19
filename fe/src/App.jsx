import React, { useContext } from "react";
import AppRouter from "./route/Router";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { AppContext } from "./contexts/app.context";
import { io } from "socket.io-client";

function App() {
  const { profile } = useContext(AppContext);
  useEffect(() => {
    if (!profile?.id) return;

    const socket = io("http://localhost:3000", {
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
      toast.success(noti.message, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: true,
        draggable: true,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [profile?.id]);

  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
}

export default App;
