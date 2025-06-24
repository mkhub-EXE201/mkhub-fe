import http from "../utils/http";

export const bookingUrl = "bookings";

const bookingApis = {
  addBookingRequest: (payload) => http.post(`${bookingUrl}/add`, payload),
  getBookingRequests: (type) => http.get(`${bookingUrl}?type=${type}`),
  verifyBookingRequest: (booking_id, payload) =>
    http.post(`${bookingUrl}/verify/${booking_id}`, payload),
};
export default bookingApis;
