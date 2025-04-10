import http from "../utils/http";

export const userUrl = "/users";

const userApis = {
  login: (body) => http.post(`${userUrl}/login`, body),
  register: (body) => http.post(`${userUrl}/register`, body),
  loginWithGoogle: () => http.get(`${userUrl}/oauth/google`),
};
export default userApis;
