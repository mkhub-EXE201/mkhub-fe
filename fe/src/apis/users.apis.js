import http from "../utils/http";

export const userRoute = "users";
export const loginUrl = "login";
export const registerUrl = "register";
export const loginWithGoogle = "oauth/google";
export const logoutUrl = "logout";

const userApis = {
  login: (body) => http.post(`/${userRoute}/${loginUrl}`, body),
  register: (body) => http.post(`/${userRoute}/${registerUrl}`, body),
  loginWithGoogle: () => http.get(`/${userRoute}/${loginUrl}`),
  logout: (body) =>
    http.post(`${userRoute}/${logoutUrl}`, { refresh_token: body }),
};
export default userApis;
