import http from "../utils/http";

export const aiSupportApis = "chat/ai";

const aiApis = {
  chatWithAI: (msg) => http.post(`${aiSupportApis}`, { msg }),
};
export default aiApis;
