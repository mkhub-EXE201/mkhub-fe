/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";
import {
  getAccessTokenFromLocalStorage,
  getProfileFromLocalStorage,
} from "../utils/auth";
import { USER_ROLE } from "../constants/enum";

const checkUserRole = () => {
  const profile = getProfileFromLocalStorage();
  let role = null;
  if (profile) {
    if (profile.role === USER_ROLE.ADMIN) {
      role = USER_ROLE.ADMIN;
    } else if (profile.role === USER_ROLE.MEMBER && profile.is_artist) {
      role = USER_ROLE.ARTIST;
    } else {
      role = USER_ROLE.MEMBER;
    }
  }
  return role;
};
const initialAppContext = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null,
  role: checkUserRole(),
  setRole: () => null,
  reset: () => null,
};
export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAppContext.isAuthenticated || false
  );
  const getInitialRole = () => localStorage.getItem("role") || checkUserRole();
  const [profile, setProfile] = useState(initialAppContext.profile);
  const [role, setRoleState] = useState(getInitialRole());
  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
    setRole(null);
  };
  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem("role", newRole);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        role,
        setRole,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
