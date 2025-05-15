import {
  Avatar,
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { AppContext } from "../contexts/app.context";
import path from "../constants/path";
import userApis from "../apis/users.apis";
import HttpStatusCode from "../constants/httpStatus";
import toast from "react-hot-toast";
import Popover from "./Popover";

export default function Navbar() {
  const { isAuthenticated, profile, setIsAuthenticated, setProfile } =
    useContext(AppContext);
  const navigate = useNavigate();
  const handleLogout = async () => {
    const response = await userApis.logout();
    if (response.status === HttpStatusCode.Ok) {
      setIsAuthenticated(false);
      setProfile(null);
      toast.success(response.data.message, {
        position: "top-center",
      });
    }
    navigate(path.home);
  };
  return (
    <Box
      sx={{
        paddingTop: { xs: 2, sm: 2, md: 5 },
        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: "center",
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Left */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Link to={path.home}>
          <img
            src={logo}
            alt="header-logo"
            style={{
              width: "100px",
              height: "auto",
              objectFit: "cover",
            }}
          />
        </Link>
        <Link
          to={path.explore}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography>Khám phá</Typography>
        </Link>

        <Link
          to={path.home}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography>Cộng đồng</Typography>
        </Link>
      </Box>
      {/* search box */}
      <Box
        display="flex"
        flexDirection={"row"}
        gap={2}
        alignItems="center"
        justifyContent="center"
      >
        <TextField
          placeholder="Tìm kiếm"
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: "80%",
              md: "400px",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "black",
                borderRadius: "20px",
              },
              "&:hover fieldset": {
                borderColor: "black",
              },
              "&.Mui-focused fieldset": {
                borderColor: "black",
              },
            },
            "& .MuiInputLabel-root": {
              borderColor: "black",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              borderColor: "black",
            },
            "& .MuiInputBase-input::placeholder": {
              borderColor: "black",
              opacity: 1,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
      {/* Right */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2,
          alignItems: "center",
        }}
      >
        <Button variant="contained" sx={{ borderRadius: "50px" }}>
          Trở thành makeup artist
        </Button>
        {!isAuthenticated ? (
          <>
            <Link
              to={path.home}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography>Đăng nhập</Typography>
            </Link>
            <Link
              to={path.register}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography>Đăng kí</Typography>
            </Link>
          </>
        ) : (
          <Box>
            <Popover
              renderPopover={
                <Box
                  sx={{
                    position: "relative",
                    borderRadius: 1,
                    bgcolor: "white",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      color: "black",
                    }}
                  >
                    <Link to={path.profile}>
                      <Button
                        sx={{
                          py: 1,
                          px: 1.5,
                          justifyContent: "flex-start",
                          color: "black",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: (theme) => theme.palette.lightGray,
                          },
                        }}
                      >
                        Thông tin tài khoản
                      </Button>
                    </Link>

                    <Button
                      sx={{
                        mt: 1,
                        py: 1,
                        px: 1.5,
                        justifyContent: "flex-start",
                        color: "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.lightGray,
                        },
                      }}
                    >
                      Yêu cầu của tôi
                    </Button>

                    <Button
                      onClick={() => handleLogout()}
                      sx={{
                        mt: 1,
                        py: 1,
                        px: 1.5,
                        justifyContent: "flex-start",
                        color: "black",
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: (theme) => theme.palette.lightGray,
                        },
                      }}
                    >
                      Đăng xuất
                    </Button>
                  </Box>
                </Box>
              }
            >
              <Avatar
                src={profile.avatar_url}
                alt="avatar"
                sx={{
                  width: 40,
                  height: 40,
                }}
              />
            </Popover>
          </Box>
        )}
      </Box>
    </Box>
  );
}
