import http from "../utils/http";

export const feedbackUrl = "feedbacks";
const feedbackApis = {
  getFeedbacks: () => http.get(`${feedbackUrl}`),
  getFeedback: (type, id) => http.get(`${feedbackUrl}/${id}?type=${type}`),
  feedback: (payload) => http.post(`/${feedbackUrl}`, payload),
};
export default feedbackApis;
