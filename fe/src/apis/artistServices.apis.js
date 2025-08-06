import http from "../utils/http";

export const artistServiceUrl = "services";

const artistServiceApis = {
  addNewService: (payload) => http.post(`${artistServiceUrl}/create`, payload),
  getOneAllServices: (user_id) =>
    http.get(`${artistServiceUrl}/${user_id}/all`),
  getAllServices: (params = {}) => http.get(`${artistServiceUrl}`, { params }),
  deleteService: (service_id, artist_id) =>
    http.delete(`${artistServiceUrl}/${artist_id}/${service_id}`),
};
export default artistServiceApis;
