export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem("access_token") || "";
};
export const setAccessTokenToLocalStorage = (accessToken) => {
  localStorage.setItem("access_token", accessToken);
};
export const getProfileFromLocalStorage = () => {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
};
export const setProfileToLocalStorage = (profile) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};
export const getRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem("refresh_token") || "";
};
export const setRefreshTokenToLocalStorage = (refreshToken) => {
  localStorage.setItem("refresh_token", refreshToken);
};
export const clearLocalStorage = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("profile");
};
