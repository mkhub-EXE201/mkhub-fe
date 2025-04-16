import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";

export default function ForgotPassword() {
  return (
    <Box
      sx={{
        bgcolor: "grey.50",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: { xs: 8, lg: 0 },
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            fontWeight="bold"
            color="text.primary"
            mb={3}
          >
            Quên mật khẩu
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Typography
              sx={{
                textAlign: "center",
                color: "#DBDBDB",
                fontSize: 14,
                paddingX: 3,
              }}
            >
              Có vẻ như bạn đã quên mật khẩu. Nhập email của bạn, và chúng tôi
              sẽ gửi cho bạn liên kết để khôi phục lại tài khoản.
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Gửi mail
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
