import {
  Box,
  Button,
  Chip,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import logo from "../assets/logo.png";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { AppContext } from "../contexts/app.context";

export default function Headers() {
  const { isAuthenticated } = useContext(AppContext);
  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(0deg, #FEBED0 -17.62%, #091B65 58.6%)",
        borderBottomLeftRadius: { xs: "20px", sm: "100px", md: "150px" },
        borderBottomRightRadius: { xs: "20px", sm: "100px", md: "150px" },

        paddingX: { xs: 2, sm: 3, md: 7 },
        paddingBottom: { xs: 1, sm: 1, md: 1 },
        paddingTop: { xs: 2, sm: 2, md: 5 },
      }}
    >
      {/* Header top */}
      <Box
        sx={{
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
          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color="white">Khám phá</Typography>
          </Link>

          <Link to={"/"} style={{ textDecoration: "none", color: "inherit" }}>
            <Typography color="white">Cộng đồng</Typography>
          </Link>
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
                <Typography color="white">Đăng nhập</Typography>
              </Link>
              <Link
                to={"/register"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Typography color="white">Đăng kí</Typography>
              </Link>
            </>
          ) : (
            <>
              <Typography>profile</Typography>
            </>
          )}
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          my: { xs: 5, md: 10 },
          mx: "auto",
          px: { xs: 2, sm: 4, md: 10 },
        }}
      >
        <Box textAlign="center">
          <Typography
            textTransform="uppercase"
            color="white"
            sx={{ fontSize: { xs: "20px", sm: "28px", md: "44px" } }}
            fontWeight={500}
          >
            Một nền tảng kết nối makeup artist Makeup hub
          </Typography>

          {/* Search */}
          <Box
            display="flex"
            gap={2}
            alignItems="center"
            justifyContent="center"
          >
            <TextField
              placeholder="Tôi đang tìm kiếm dịch vụ..."
              size="small"
              sx={{
                mt: 3,
                width: {
                  xs: "100%",
                  sm: "80%",
                  md: "600px",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#fff",
                    borderRadius: "20px",
                  },
                  "&:hover fieldset": {
                    borderColor: "#fff",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#fff",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#fff",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#fff",
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "#fff",
                  opacity: 1,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon sx={{ color: "white" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          {/* hashtag */}
          <Box
            sx={{
              marginTop: { md: 5, sm: 5, xs: 2 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: { lg: 4, md: 4, sm: 2, xs: 1 },
            }}
          >
            {/* row 1: 4 chips */}
            <Box
              sx={{
                display: "flex",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                gap: { lg: 4, md: 4, sm: 2, xs: 1 },
              }}
            >
              {Array(4)
                .fill(0)
                .map((_, index) => (
                  <Chip
                    key={index}
                    label="#hashtag"
                    sx={{
                      backgroundColor: (theme) => theme.palette.ochre.lightGrey,
                      color: (theme) => theme.palette.ochre.dark,
                      fontWeight: 500,
                      borderRadius: "999px",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.ochre.light,
                      },
                    }}
                    onClick={() => {}}
                  />
                ))}
            </Box>

            {/* row 2: 3 chips */}
            <Box
              sx={{
                display: "flex",
                gap: { lg: 4, md: 4, sm: 2, xs: 1 },
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
              }}
            >
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <Chip
                    key={index + 4}
                    label="#hashtag"
                    sx={{
                      backgroundColor: (theme) => theme.palette.ochre.lightGrey,
                      color: (theme) => theme.palette.ochre.dark,
                      fontWeight: 500,
                      borderRadius: "999px",
                      "&:hover": {
                        backgroundColor: (theme) => theme.palette.ochre.light,
                      },
                    }}
                    onClick={() => {}}
                  />
                ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
