import axios from "axios";
import { loginUrl, logoutUrl, registerUrl } from "../apis/users.apis";
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "./auth";
class Http {
  instance;
  accessToken;
  refreshToken;
  refreshTokenRequest;
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage();
    this.refreshToken = getRefreshTokenFromLocalStorage();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      baseURL: "http://localhost:3000",
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    ),
      this.instance.interceptors.response.use((response) => {
        const { url } = response.config;
        if (url.includes(loginUrl) || url.includes(registerUrl)) {
          this.accessToken = response.data.result.access_token;
          this.refreshToken = response.data.result.refresh_token;
          setAccessTokenToLocalStorage(this.accessToken);
          setRefreshTokenToLocalStorage(this.refreshToken);
          setProfileToLocalStorage(response.data.result.user);
        } else if (url.includes(logoutUrl)) {
          this.accessToken = "";
          this.refreshToken = "";
          clearLocalStorage();
        }
        return response;
      });
  }
}

const http = new Http().instance;
export default http;
