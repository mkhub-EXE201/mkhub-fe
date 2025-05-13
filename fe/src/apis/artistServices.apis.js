import http from "../utils/http";

export const artistServiceUrl = "services";

const artistServiceApis = {
  addNewService: (payload) => http.post(`${artistServiceUrl}/create`, payload),
  getOneAllServices: () => http.get(`${artistServiceUrl}/all`),
};
export default artistServiceApis;
