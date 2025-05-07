import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";
import loginImage from "../assets/login.jpeg";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../schemas/loginSchema";
import { isAxiosUnprocessableEntityError } from "../utils/errors.type";
import HttpStatusCode from "../constants/httpStatus";
import userApis from "../apis/users.apis";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AppContext } from "../contexts/app.context";

export default function Login() {
  const navigate = useNavigate();
  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const { setIsAuthenticated, setProfile } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleFormSubmit = handleSubmit(async (data) => {
    try {
      const response = await userApis.login(data);
      if (response.status === HttpStatusCode.Ok) {
        setIsAuthenticated(true);
        setProfile(response.data.result.user);

        if (
          response.data.result.user.role === "MEMBER" &&
          response.data.result.user.is_artist
        ) {
          navigate("/artist");
        }
        if (
          response.data.result.user.role === "MEMBER" &&
          !response.data.result.user.is_artist
        ) {
          navigate("/");
        }
        if (response.data.result.user.role === "ADMIN") {
          navigate("/admin");
        }
        toast.success(response.data.message, {
          position: "top-center",
        });
      }
    } catch (error) {
      if (isAxiosUnprocessableEntityError(error)) {
        const formError = error.response.data.errors;
        Object.keys(formError).forEach((key) => {
          setError(key, {
            type: "Server",
            message: formError[key],
          });
        });
      }
    }
  });

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginWithGoogle = async () => {
    const response = await userApis.loginWithGoogle();

    if (response.status === HttpStatusCode.Ok) {
      window.open(response.data.result, "_self");
    }
  };
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Grid
        container
        spacing={0}
        sx={{
          height: "100%",
          width: "100vw",
          flexWrap: "nowrap",
          margin: 0,
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
        }}
      >
        {/* Left column - Form */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            minWidth: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",

            "@media (max-width: 900px)": {
              width: "100%",
              height: "100vh",
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              p: 2,
              width: "400px",
            }}
          >
            <Box sx={{ mb: 2, alignSelf: "flex-start", ml: -1 }}>
              <img
                src={logo}
                alt="Makeup Hub Logo"
                style={{ height: "70px", width: "auto" }}
              />
            </Box>

            <Typography
              component="h1"
              variant="h5"
              sx={{ mb: 3, fontStyle: "italic" }}
            >
              Xin chào
            </Typography>

            <Box
              sx={{
                "& .MuiTextField-root": { width: "100%" },
                width: "100%",
              }}
            >
              <form onSubmit={handleFormSubmit} noValidate autoComplete="off">
                <TextField
                  required
                  fullWidth
                  label="Email / Số điện thoại"
                  size="small"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message || " "}
                  variant="outlined"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "12px",
                      minHeight: "12px",
                      my: "2px",
                    },
                  }}
                />

                <TextField
                  required
                  fullWidth
                  label="Mật khẩu"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message || " "}
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                    "& .MuiFormHelperText-root": {
                      fontSize: "12px",
                      minHeight: "12px",
                      my: "2px",
                    },
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Link
                  to={"/forgot-password"}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                  }}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                    mt: 1,
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="body2"
                    color="primary"
                    sx={{ cursor: "pointer" }}
                  >
                    Quên mật khẩu?
                  </Typography>
                </Link>

                <Button
                  type="submit"
                  fullWidth
                  variant={
                    watch("email") && watch("password")
                      ? "contained"
                      : "outlined"
                  }
                  disabled={!watch("email") || !watch("password")}
                  sx={{
                    mt: 2,
                    py: 1.2,
                    borderRadius: "20px",
                    cursor:
                      watch("email") && watch("password")
                        ? "pointer"
                        : "not-allowed",
                  }}
                >
                  Đăng nhập
                </Button>

                <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                  <Divider sx={{ flexGrow: 1 }} />
                  <Typography
                    variant="body2"
                    sx={{ mx: 2, color: "text.secondary" }}
                  >
                    hoặc
                  </Typography>
                  <Divider sx={{ flexGrow: 1 }} />
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  sx={{
                    py: 1.2,
                    borderRadius: "20px",
                    textTransform: "none",
                    borderColor: "#DADCE0",
                    color: "#3c4043",
                    "&:hover": {
                      backgroundColor: "#f5f5f5",
                      borderColor: "#DADCE0",
                    },
                  }}
                  onClick={() => handleLoginWithGoogle()}
                >
                  Đăng nhập với Google
                </Button>

                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                  Chưa có tài khoản?{" "}
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Đăng ký ngay
                  </Typography>
                </Typography>
              </form>
            </Box>
          </Box>
        </Grid>

        {/* Right column - Image */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            minWidth: 0,
            display: { xs: "none", md: "block" },
            height: "100%",
            marginLeft: "auto",
            padding: 0,
            width: "50vw",
          }}
        >
          <Box
            sx={{
              height: "100vh",
              width: "100%",
              margin: 0,
              padding: 0,
              position: "relative",
            }}
          >
            <img
              src={loginImage}
              alt="Login"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "90px 0 0 90px",
                display: "block",
                margin: 0,
              }}
            />
            <img
              src={logoWhite}
              alt="Overlay"
              style={{
                position: "absolute",
                bottom: "20px",
                right: "55px",
                width: "300px",
                height: "auto",
                objectFit: "cover",
                zIndex: 10,
              }}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
