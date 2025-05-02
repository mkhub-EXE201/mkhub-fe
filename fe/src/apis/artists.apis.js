import http from "../utils/http";

export const artistUrl = "artists";

const artistApis = {
  registerArtist: (payload) => http.post(`${artistUrl}/register`, payload),
};
export default artistApis;
