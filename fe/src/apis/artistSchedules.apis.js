import http from "../utils/http";

export const artistScheduleUrl = "artist-schedules";

const artistSchedulesApis = {
  addNewWorkingSchedule: (payload) =>
    http.post(`${artistScheduleUrl}/create`, payload),
  getWorkingSchedule: (schedule_id) =>
    http.get(`${artistScheduleUrl}/${schedule_id}`),
};

export default artistSchedulesApis;
