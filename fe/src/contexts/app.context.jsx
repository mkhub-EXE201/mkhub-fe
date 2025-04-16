/* eslint-disable react/prop-types */
import React, { createContext, useState } from "react";
import {
  getAccessTokenFromLocalStorage,
  getProfileFromLocalStorage,
} from "../utils/auth";

const initialAppContext = {
  isAuthenticated: Boolean(getAccessTokenFromLocalStorage()),
  setIsAuthenticated: () => null,
  profile: getProfileFromLocalStorage(),
  setProfile: () => null,
  reset: () => null,
};

export const AppContext = createContext(initialAppContext);

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    initialAppContext.isAuthenticated
  );
  const [profile, setProfile] = useState(initialAppContext.profile);
  const reset = () => {
    setIsAuthenticated(false);
    setProfile(null);
  };
  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        profile,
        setProfile,
        reset,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
