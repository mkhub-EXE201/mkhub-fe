import { get } from "react-hook-form";
import http from "../utils/http";

export const artistLocationUrl = "artist-locations";

const artistLocationApis = {
  getArtistWorkingLocations: () => http.get(`${artistLocationUrl}/all`),
};
export default artistLocationApis;
