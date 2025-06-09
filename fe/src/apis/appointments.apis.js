import http from "../utils/http";

export const appointmentUrl = "appointments";

const appointmentApis = {
  getAllAppointments: (role) => http.get(`/${appointmentUrl}?role=${role}`),
};
export default appointmentApis;
