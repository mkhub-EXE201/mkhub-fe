export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem("access_token") || "";
};
export const getProfileFromLocalStorage = () => {
  const profile = localStorage.getItem("profile");
  return profile ? JSON.parse(profile) : null;
};
export const setProfileToLocalStorage = (profile) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};
export const setRefreshTokenToLocalStorage = (refreshToken) => {
  localStorage.setItem("refresh_token", refreshToken);
};
export const getRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem("refresh_token") || "";
};
