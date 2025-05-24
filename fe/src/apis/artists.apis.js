import axios from "axios";
import http from "../utils/http";

export const artistUrl = "artists";

const artistApis = {
  registerArtist: (payload) => http.post(`${artistUrl}/register`, payload),
  getArtistProfile: (artist_id) => http.get(`${artistUrl}/${artist_id}/me`),
  getPortfolioIcon: (domain, size) => {
    const corsProxy = "https://cors-anywhere.herokuapp.com/";
    return axios.get(
      `${corsProxy}https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`
    );
  },
  getArtistPhotos: (artist_id) => http.get(`${artistUrl}/${artist_id}/photos`),
  getArtistPosts: (artist_id) => http.get(`${artistUrl}/${artist_id}/posts`),
  getAllArtists: () => http.get(`${artistUrl}/all`),
};
export default artistApis;
