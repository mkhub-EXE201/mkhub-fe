import {
  Box,
  Button,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { AppContext } from "../contexts/app.context";

export default function Navbar() {
  const { isAuthenticated } = useContext(AppContext);

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
        <img
          src={logo}
          onClick={() => <Link to={"/"} />}
          alt="header-logo"
          style={{
            width: "100px",
            height: "auto",
            objectFit: "cover",
          }}
        />
        <Link
          to={"/explore"}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Typography>Khám phá</Typography>
        </Link>

        <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
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
              to={"/login"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography>Đăng nhập</Typography>
            </Link>
            <Link
              to={"/register"}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Typography>Đăng kí</Typography>
            </Link>
          </>
        ) : (
          <Box>
            <img
              src="https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"
              width={50}
              height={50}
              style={{ objectFit: "contain" }}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}
