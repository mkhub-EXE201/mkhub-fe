import http from "../utils/http";

export const artistLocationUrl = "artist-locations";

const artistLocationApis = {
  getArtistWorkingLocations: (artist_id) =>
    http.get(`${artistLocationUrl}/${artist_id}/all`),
};
export default artistLocationApis;
