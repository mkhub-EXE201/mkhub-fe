import http from "../utils/http";

export const adminUrl = "admin";

const adminApis = {
  getArtistApplicationsByStatus: (status) =>
    http.get(`${adminUrl}/artists/applications/${status}`),
};
export default adminApis;
