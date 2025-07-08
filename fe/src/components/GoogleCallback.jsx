import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import path from "../constants/path";
import { AppContext } from "../contexts/app.context";
import { decodeToken } from "../utils/jwt";
import {
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "../utils/auth";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile, setRole } = useContext(AppContext);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get("access_token");
    const refresh_token = urlParams.get("refresh_token");
    if (access_token) {
      try {
        const decoded = decodeToken(access_token);
        const userData = {
          id: decoded.id,
          name: decoded.unique_name,
          email: decoded.email,
          avartar: decoded.avartar,
          role: decoded.role,
          isModerator: decoded.isModerator,
        };

        setIsAuthenticated(true);
        setProfile(userData);
        setRole(userData.role);
        setAccessTokenToLocalStorage(access_token);
        setRefreshTokenToLocalStorage(refresh_token);
        setProfileToLocalStorage(userData);
        toast.success("Đăng nhập thành công!");
        navigate(path.home);
      } catch (error) {
        toast.error(error.message);
        navigate(path.login);
      }
    } else {
      toast.error("Không có token trong URL!");
      navigate(path.login);
    }
  }, []);
  return <></>;
};

export default GoogleCallback;
