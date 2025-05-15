import axios from "axios";
import http from "../utils/http";

export const artistUrl = "artists";

const artistApis = {
  registerArtist: (payload) => http.post(`${artistUrl}/register`, payload),
  getArtistProfile: (user_id) => http.get(`${artistUrl}/${user_id}/me`),
  getPortfolioIcon: (domain, size) => {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    return axios.get(
      `${corsProxy}https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
    );
  },
  getArtistPhotos: (user_id) => http.get(`${artistUrl}/${user_id}/photos`),
  getArtistPosts: (user_id) => http.get(`${artistUrl}/${user_id}/posts`),
  getAllArtists: () => http.get(`${artistUrl}/all`),
};
export default artistApis;
