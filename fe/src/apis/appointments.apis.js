import http from "../utils/http";

export const appointmentUrl = "appointments";

const appointmentApis = {
  getAllAppointments: (role) => http.get(`/${appointmentUrl}?role=${role}`),
  getAppointmentById: (id, type) =>
    http.get(`/${appointmentUrl}/${id}?type=${type}`),
};
export default appointmentApis;
