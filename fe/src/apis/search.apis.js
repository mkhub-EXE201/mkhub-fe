import http from "../utils/http";

export const searchUrl = "search";

const searchApis = {
  search: (limit, page, content) =>
    http.get(`${searchUrl}?limit=${limit}&page=${page}&content=${content}`),
};
export default searchApis;
