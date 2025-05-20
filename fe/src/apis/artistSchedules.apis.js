import http from "../utils/http";

export const artistScheduleUrl = "artist-schedules";

const artistSchedulesApis = {
  addNewWorkingSchedule: (payload) =>
    http.post(`${artistScheduleUrl}/create`, payload),
  getAllArtistWokingSchedule: () => http.get(`${artistScheduleUrl}/`),
};

export default artistSchedulesApis;
