import http from "../utils/http";

export const artistServiceUrl = "services";

const artistServiceApis = {
  addNewService: (payload) => http.post(`${artistServiceUrl}/create`, payload),
  getOneAllServices: (user_id) =>
    http.get(`${artistServiceUrl}/${user_id}/all`),
};
export default artistServiceApis;
