import http from "../utils/http";

export const categoriesUrl = "categories";

const categoryApis = {
  getAllCategories: () => http.get(`${categoriesUrl}/`),
};
export default categoryApis;
