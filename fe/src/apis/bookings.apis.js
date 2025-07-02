import http from "../utils/http";

export const bookingUrl = "bookings";

const bookingApis = {
  addBookingRequest: (payload) => http.post(`${bookingUrl}/add`, payload),
  getBookingRequests: (type) => {
    const url = type ? `${bookingUrl}?type=${type}` : bookingUrl;
    return http.get(url);
  },
  verifyBookingRequest: (booking_id, payload) =>
    http.post(`${bookingUrl}/verify/${booking_id}`, payload),
  getTotalBookings: () => http.get(`${bookingUrl}/total`),
};
export default bookingApis;
