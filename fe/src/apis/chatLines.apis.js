import http from "../utils/http";

export const chatLineUrl = "conversations";

const chatLineApis = {
  sendMessage: (payload) => http.post(`${chatLineUrl}`, payload),
};
export default chatLineApis;
