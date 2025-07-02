import { getRefreshTokenFromLocalStorage } from "../utils/auth";
import http from "../utils/http";

export const userRoute = "users";
export const loginUrl = "login";
export const registerUrl = "register";
export const loginWithGoogle = "oauth/google";
export const logoutUrl = "logout";
export const refreshTokenUrl = "refresh-token";
export const getAllUsers = "all";
export const getTotalUserNum = "total";

const userApis = {
  login: (body) => http.post(`/${userRoute}/${loginUrl}`, body),
  register: (body) => http.post(`/${userRoute}/${registerUrl}`, body),
  loginWithGoogle: () => http.get(`/${userRoute}/${loginWithGoogle}`),
  logout: () =>
    http.post(`${userRoute}/${logoutUrl}`, {
      refresh_token: getRefreshTokenFromLocalStorage(),
    }),
  refreshToken: () => {
    http.post(`${userRoute}/${refreshTokenUrl}`, {
      refresh_token: getRefreshTokenFromLocalStorage(),
    });
  },
  getAllUsers: () => http.get(`${userRoute}/${getAllUsers}`),
  getArtistDetail: (artist_id) => http.get(`${userRoute}/artists/${artist_id}`),
  getMe: () => http.get(`${userRoute}/me`),
  getUser: (user_id) => http.get(`${userRoute}/${user_id}`),
  getUsers: () => http.get(`${userRoute}`),
  updateMe: (body) => http.patch(`${userRoute}/me`, body),
  getTotalNumOfUers: () => http.get(`${userRoute}/${getTotalUserNum}`),
};
export default userApis;
