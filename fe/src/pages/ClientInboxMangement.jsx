import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import ChatSideBar from "../components/ChatSideBar";
import ChatWindow from "../components/ChatWindow";
import chatRoomApis from "../apis/chatRooms.apis";
import { MESSAGE_SENDER_TYPE } from "../constants/enum";
import { HttpStatusCode } from "axios";
import { AppContext } from "../contexts/app.context";

export default function ClientInboxManagement() {
  const { profile } = useContext(AppContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const getChatRooms = async () => {
    const response = await chatRoomApis.getAllChats(
      profile.id,
      MESSAGE_SENDER_TYPE.CLIENT
    );
    if (response.status === HttpStatusCode.Ok) {
      setChatRooms(response.data.result);
    }
  };

  useEffect(() => {
    getChatRooms();
  }, []);

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <ChatSideBar
        isClient
        chatRooms={chatRooms}
        selectedRoom={selectedRoom}
        onSelect={setSelectedRoom}
      />
      <ChatWindow room={selectedRoom} isClient />
    </Box>
  );
}
