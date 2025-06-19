import http from "../utils/http";

export const adminUrl = "admin";

const adminApis = {
  getArtistApplicationsByStatus: (status) =>
    http.get(`${adminUrl}/artists/applications/${status}`),
  verifyArtistApplication: (application_id, payload) =>
    http.post(`/${adminUrl}/artists/${application_id}/verify`, payload),
  getPlatformRevenue: () => http.get(`${adminUrl}/balance`),
  getAllAppointments: () => http.get(`${adminUrl}/appointments`),
};
export default adminApis;
