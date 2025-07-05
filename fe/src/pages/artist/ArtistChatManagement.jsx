import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import ChatWindow from "../../components/ChatWindow";
import ChatSideBar from "../../components/ChatSideBar";
import chatRoomApis from "../../apis/chatRooms.apis";
import { AppContext } from "../../contexts/app.context";
import { MESSAGE_SENDER_TYPE } from "../../constants/enum";
import { HttpStatusCode } from "axios";

export default function ArtistChatManagement() {
  const { profile } = useContext(AppContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const getChatRooms = async () => {
    const response = await chatRoomApis.getAllChats(
      profile.artist_id,
      MESSAGE_SENDER_TYPE.ARTIST
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
        isClient={false}
        chatRooms={chatRooms}
        selectedRoom={selectedRoom}
        onSelect={setSelectedRoom}
      />
      <ChatWindow room={selectedRoom} isClient={false} />
    </Box>
  );
}
