import http from "../utils/http";

export const postRoute = "posts";

const postApis = {
  getAllComments: (post_id) => http.get(`/${postRoute}/${post_id}/comments`),
  getAllReactions: (post_id) => http.get(`/${postRoute}/${post_id}/reactions`),
  addPost: (payload) => http.post(`${postRoute}/add-post`, payload),
  getAllPosts: () => http.get(`${postRoute}/all`),
};

export default postApis;
