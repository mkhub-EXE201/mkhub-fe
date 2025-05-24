import axios, { HttpStatusCode } from "axios";
import {
  loginUrl,
  logoutUrl,
  refreshTokenUrl,
  registerUrl,
  userRoute,
} from "../apis/users.apis";
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage,
  setRoleToLocalStorage,
} from "./auth";
import toast from "react-hot-toast";
import {
  isAxiosExpiredTokenError,
  isAxiosUnauthorizedError,
} from "./errors.type";
import { USER_ROLE } from "../constants/enum";
class Http {
  instance;
  accessToken = "";
  refreshToken = "";
  refreshTokenRequest = null;
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage();
    this.refreshToken = getRefreshTokenFromLocalStorage();
    this.refreshTokenRequest = null;
    this.instance = axios.create({
      // baseURL: "http://localhost:3000",
      baseURL: "https://mkhub-be.onrender.com",
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
    );
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config;
        if (url.includes(loginUrl)) {
          this.accessToken = response.data.result.access_token;
          this.refreshToken = response.data.result.refresh_token;
          setAccessTokenToLocalStorage(this.accessToken);
          setRefreshTokenToLocalStorage(this.refreshToken);
          setProfileToLocalStorage(response.data.result.user);
          let role = USER_ROLE.ADMIN;
          if (
            response.data.result.user.role === USER_ROLE.MEMBER &&
            response.data.result.user.is_artist
          ) {
            role = USER_ROLE.ARTIST;
          } else if (
            response.data.result.user.role === USER_ROLE.MEMBER &&
            !response.data.result.user.is_artist
          ) {
            role = USER_ROLE.MEMBER;
          }
          setRoleToLocalStorage(role);
        } else if (url.includes(logoutUrl)) {
          clearLocalStorage();
          this.accessToken = "";
          this.refreshToken = "";
        }
        return response;
      },
      (error) => {
        if (
          ![
            HttpStatusCode.UnprocessableEntity,
            HttpStatusCode.Unauthorized,
          ].includes(error.response?.status)
        ) {
          const data = error.response?.data;
          const message = data?.message || error?.message;
          toast.error(message);
        }
        if (isAxiosUnauthorizedError(error)) {
          const config = error.response?.config || { headers: {}, url: "" };
          const { url } = config;
          if (
            isAxiosExpiredTokenError(error) &&
            !url.includes(refreshTokenUrl)
          ) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null;
                  }, 10000);
                });

            return this.refreshTokenRequest.then(({ access_token }) => {
              return this.instance({
                ...config,
                headers: {
                  ...config.headers,
                  authorization: `Bearer ${access_token}`,
                },
              });
            });
          }
          toast.error(
            error.response?.data.data?.message || error.response?.data.message
          );
          clearLocalStorage();
          this.accessToken = "";
          this.refreshToken = "";
        }
        return Promise.reject(error);
      }
    );
  }
  handleRefreshToken() {
    return this.instance
      .post(`${userRoute}/${refreshTokenUrl}`, {
        refresh_token: this.refreshToken,
      })
      .then(async (response) => {
        this.accessToken = response.data.result.access_token;
        this.refreshToken = response.data.result.refresh_token;

        setAccessTokenToLocalStorage(this.accessToken);
        setRefreshTokenToLocalStorage(this.refreshToken);
        return {
          access_token: this.accessToken,
          refresh_token: this.refreshToken,
        };
      })
      .catch(async (error) => {
        clearLocalStorage();
        this.accessToken = "";
        this.refreshToken = "";
        throw error;
      });
  }
}

const http = new Http().instance;
export default http;
