import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { decodeToken } from "../utils/jwt";
import { setToken, setUser } from "../store/slices/users.slices";
import path from "../constants/path";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (token) {
      try {
        const decoded = decodeToken(token);
        const userData = {
          id: decoded.id,
          name: decoded.unique_name,
          email: decoded.email,
          avartar: decoded.avartar,
          role: decoded.role,
          isModerator: decoded.isModerator,
        };

        dispatch(setUser(userData));
        dispatch(setToken(token));
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
