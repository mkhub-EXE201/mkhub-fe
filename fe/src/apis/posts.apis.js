import http from "../utils/http";

export const postRoute = "posts";

const postApis = {
  getAllComments: (post_id) => http.get(`/${postRoute}/${post_id}/comments`),
};
export default postApis;
