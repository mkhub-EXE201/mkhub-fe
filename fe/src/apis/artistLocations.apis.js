import http from "../utils/http";

export const artistLocationUrl = "artist-locations";

const artistLocationApis = {
  getArtistWorkingLocations: (artist_id) =>
    http.get(`${artistLocationUrl}/${artist_id}/all`),
  findNearArtists: (province_id, district_id) =>
    http.get(
      `${artistLocationUrl}/nearest?province_id=${province_id}&district_id=${district_id}`
    ),
};
export default artistLocationApis;
