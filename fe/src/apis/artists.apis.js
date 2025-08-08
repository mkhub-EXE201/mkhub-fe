import axios from "axios";
import http from "../utils/http";

export const artistUrl = "artists";

const artistApis = {
  registerArtist: (payload) => http.post(`${artistUrl}/register`, payload),
  getArtistProfile: () => http.get(`${artistUrl}/me`),
  updateArtistProfile: (artist_id, body) =>
    http.patch(`${artistUrl}/${artist_id}/me`, body),
  getPortfolioIcon: (domain, size) => {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    return axios.get(
      `${corsProxy}https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
    );
  },
  getArtistPhotos: (artist_id) => http.get(`${artistUrl}/${artist_id}/photos`),
  getArtistPosts: (artist_id) => http.get(`${artistUrl}/${artist_id}/posts`),
  getAllArtists: () => http.get(`${artistUrl}/all`),
  getAllArtistWokingSchedule: (artist_id) =>
    http.get(`${artistUrl}/${artist_id}/schedules`),
  getArtistPaymentAccountStatus: () =>
    http.get(`${artistUrl}/me/stripe/status`),
  getTotalApplications: () => http.get(`${artistUrl}/applications/total`),
  getRequests: () => http.get(`${artistUrl}/requests`),
  getArtistRevenue: () => http.get(`${artistUrl}/stripe/balance`),
  getArtistStats: () => http.get(`${artistUrl}/stats`),
};
export default artistApis;
