import http from "../utils/http";

const paymentUrl = "/payments";
const paymentApi = {
  async createPaymentSession(payload) {
    return await http.post(`${paymentUrl}/checkout`, payload);
  },
  async connect() {
    return await http.post(`${paymentUrl}/connect`);
  },
};
export default paymentApi;
