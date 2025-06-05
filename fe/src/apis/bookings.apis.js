import http from "../utils/http";

export const bookingUrl = "bookings";

const bookingApis = {
  addBookingRequest: (payload) => http.post(`${bookingUrl}/add`, payload),
};
export default bookingApis;
