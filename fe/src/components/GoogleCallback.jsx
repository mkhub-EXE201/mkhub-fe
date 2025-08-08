import { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import path from "../constants/path";
import { AppContext } from "../contexts/app.context";
import {
  setAccessTokenToLocalStorage,
  setProfileToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "../utils/auth";
import userApis from "../apis/users.apis";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { setIsAuthenticated, setProfile, setRole } = useContext(AppContext);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get("access_token");
    const refresh_token = urlParams.get("refresh_token");
    setAccessTokenToLocalStorage(access_token);
    setRefreshTokenToLocalStorage(refresh_token);
    const fetchUserProfile = async () => {
      try {
        const response = await userApis.getMe();
        const userData = response.data.result;
        setIsAuthenticated(true);
        setProfile(userData);
        setRole(userData.role);

        setProfileToLocalStorage(userData);
        toast.success("Đăng nhập thành công!");
        navigate(path.home);
      } catch (error) {
        toast.error("Lấy thông tin người dùng thất bại");
        navigate(path.login);
        console.log(error);
      }
    };

    if (access_token) {
      try {
        fetchUserProfile();
      } catch (error) {
        toast.error("Token không hợp lệ!");
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
