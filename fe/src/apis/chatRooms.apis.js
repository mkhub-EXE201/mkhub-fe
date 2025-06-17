import http from "../utils/http";

export const chatRoomUrl = "rooms";

const chatRoomApis = {
  getChatHistory: ({ client_id, artist_id }) =>
    http.get(`${chatRoomUrl}?client_id=${client_id}&artist_id=${artist_id}`),
};
export default chatRoomApis;
