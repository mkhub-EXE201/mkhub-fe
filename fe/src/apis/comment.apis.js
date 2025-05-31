import http from "../utils/http";

export const commentRoute = "comments";

const commentApis = {
  addComment: (body) => http.post(`/${commentRoute}/add`, body),
};
export default commentApis;
