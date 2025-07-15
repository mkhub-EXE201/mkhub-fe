import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Grid,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import logo from "../assets/logo.png";
import logoWhite from "../assets/logo-white.png";
import RegisterImage from "../assets/signup.jpeg";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { registerSchema } from "../schemas/registerSchema";
import userApis from "../apis/users.apis";
import HttpStatusCode from "../constants/httpStatus";
import { isAxiosUnprocessableEntityError } from "../utils/errors.type";
import path from "../constants/path";
import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    setError,
    handleSubmit,
    watch,
    formState: { errors, isSubmmitting },
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (data) => {
    try {
      const response = await userApis.register(data);
      if (response.status === HttpStatusCode.Ok) {
        toast.success(response.data.message, {
          position: "top-center",
        });
        navigate(path.login);
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
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
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
          gap: 0,
          "@media (max-width: 900px)": {
            flexDirection: "column",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          {/* Left col - Image */}
          <Box
            sx={{
              width: "50%",
              height: "100%",
              display: { xs: "none", md: "block" },
            }}
          >
            <img
              src={RegisterImage}
              alt="Register"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0 90px 90px 0",
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
                left: "110px",
                width: "300px",
                height: "auto",
                objectFit: "cover",
                zIndex: 10,
              }}
            />
          </Box>
          {/* Right col - form */}
          <Box
            sx={{
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              "@media (max-width: 900px)": {
                width: "100%",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "400px",
              }}
            >
              {/* Logo */}
              <Box sx={{ mt: 2 }}>
                <img
                  src={logo}
                  alt="Makeup Hub Logo"
                  style={{ height: "70px", width: "auto" }}
                />
              </Box>

              <Typography
                component="h1"
                variant="h5"
                sx={{ mb: 2, fontStyle: "italic" }}
              >
                Tạo tài khoản
              </Typography>

              <Box
                sx={{
                  "& .MuiTextField-root": { width: "100%" },
                  width: "100%",
                }}
              >
                {/*form */}
                <form
                  onSubmit={handleSubmit(handleRegister)}
                  noValidate
                  autoComplete="off"
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      required
                      fullWidth
                      label="Họ"
                      size="small"
                      {...register("last_name")}
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message || " "}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: "12px",
                          my: "2px",
                        },
                      }}
                    />
                    {/* First Name Field */}
                    <TextField
                      required
                      fullWidth
                      label="Tên"
                      size="small"
                      {...register("first_name")}
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message || " "}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "20px",
                        },
                        "& .MuiFormHelperText-root": {
                          fontSize: "12px",
                          my: "2px",
                        },
                      }}
                    />
                  </Box>

                  {/* Email */}
                  <TextField
                    required
                    fullWidth
                    label="Email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message || " "}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: "12px",
                        my: "4px",
                      },
                    }}
                  />
                  {/* SĐT */}
                  <TextField
                    required
                    fullWidth
                    label="Số điện thoại"
                    {...register("phone_number")}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number?.message || " "}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: "12px",
                        my: "4px",
                      },
                    }}
                  />
                  {/* Password Field */}
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
                        my: "4px",
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
                  {/* Confirm Password Field */}
                  <TextField
                    required
                    fullWidth
                    label="Nhập lại mật khẩu"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirm_password")}
                    error={!!errors.confirm_password}
                    helperText={errors.confirm_password?.message || " "}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "20px",
                      },
                      "& .MuiFormHelperText-root": {
                        fontSize: "12px",
                      },
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleToggleConfirmPassword}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOffIcon />
                            ) : (
                              <VisibilityIcon />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/*Checkbox */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "start",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          {...register("terms", {
                            required: "Bạn cần đồng ý với điều khoản",
                          })}
                          size="small"
                          color="primary"
                        />
                      }
                      label={
                        <Typography variant="body2">
                          Tôi đồng ý với các điều khoản
                        </Typography>
                      }
                    />

                    <Typography
                      variant="caption"
                      color={errors.terms ? "error" : "transparent"}
                      sx={{ minHeight: "18px", fontSize: "12px" }}
                    >
                      {errors.terms?.message || " "}
                    </Typography>
                  </Box>

                  {/* Register Button */}
                  <Button
                    type="submit"
                    fullWidth
                    variant={
                      watch("first_name") &&
                      watch("last_name") &&
                      watch("email") &&
                      watch("phone_number") &&
                      watch("password") &&
                      watch("confirm_password")
                        ? "contained"
                        : "outlined"
                    }
                    disabled={
                      !watch("first_name") ||
                      !watch("last_name") ||
                      !watch("email") ||
                      !watch("phone_number") ||
                      !watch("password") ||
                      !watch("confirm_password")
                    }
                    sx={{
                      mt: 2,
                      py: 1.2,
                      borderRadius: "20px",
                      cursor:
                        watch("first_name") &&
                        watch("last_name") &&
                        watch("email") &&
                        watch("phone_number") &&
                        watch("password") &&
                        watch("confirm_password")
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    {isSubmmitting ? "Đang đăng ký..." : "Đăng ký"}
                  </Button>
                </form>
                <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
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
                  Đăng ký với Google
                </Button>
                <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
                  Đã có tài khoản?{" "}
                  <Typography
                    component="span"
                    color="primary"
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("/login")}
                  >
                    Đăng nhập ngay
                  </Typography>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
}
