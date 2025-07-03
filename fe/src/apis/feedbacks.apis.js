import http from "../utils/http";

export const feedbackUrl = "feedbacks";
const feedbackApis = {
  getFeedback: (type, id) => http.get(`${feedbackUrl}/${id}?type=${type}`),
};
export default feedbackApis;
