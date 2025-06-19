import http from "../utils/http";

export const appointmentUrl = "appointments";

const appointmentApis = {
  getAllAppointments: (role) => http.get(`/${appointmentUrl}?role=${role}`),
  getAppointmentById: (appointment_id) =>
    http.get(`/${appointmentUrl}/${appointment_id}`),
};
export default appointmentApis;
