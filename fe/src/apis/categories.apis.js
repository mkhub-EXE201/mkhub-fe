import http from "../utils/http";

export const categoriesUrl = "categories";

const categoryApis = {
  getAllCategories: () => http.get(`${categoriesUrl}/`),
  addCategory: (payload) => http.post(`${categoriesUrl}/create`, payload),
  deleteCategory: (category_id) =>
    http.delete(`${categoriesUrl}/${category_id}`),
};
export default categoryApis;
