import { getRefreshTokenFromLocalStorage } from "../utils/auth";
import http from "../utils/http";

export const userRoute = "users";
export const loginUrl = "login";
export const registerUrl = "register";
export const loginWithGoogle = "oauth/google";
export const logoutUrl = "logout";
export const refreshTokenUrl = "refresh-token";

const userApis = {
  login: (body) => http.post(`/${userRoute}/${loginUrl}`, body),
  register: (body) => http.post(`/${userRoute}/${registerUrl}`, body),
  loginWithGoogle: () => http.get(`/${userRoute}/${loginUrl}`),
  logout: () =>
    http.post(`${userRoute}/${logoutUrl}`, {
      refresh_token: getRefreshTokenFromLocalStorage(),
    }),
  refreshToken: () => {
    http.post(`${userRoute}/${refreshTokenUrl}`, {
      refresh_token: getRefreshTokenFromLocalStorage(),
    });
  },
};
export default userApis;
