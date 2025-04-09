import React, { useState } from 'react';
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
  Divider
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import GoogleIcon from '@mui/icons-material/Google';
import logo from '../assets/logo.png';
import RegisterImage from '../assets/signup.jpeg'; // Updated image import

export default function Register() {
  const [credentials, setCredentials] = useState({
    fullName: '',
    emailOrPhone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setCredentials({
      ...credentials,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Register credentials:', credentials);
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      <Grid
        container
        spacing={0}
        sx={{
          height: '100%',
          width: '100vw',
          flexWrap: 'nowrap',
          margin: 0,
          '@media (max-width: 900px)': {
            flexDirection: 'column'
          }
        }}
      >
        {/* Left column - Image */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            minWidth: 0,
            display: { xs: 'none', md: 'block' },
            height: '100%',
            marginRight: 'auto',
            padding: 0,
            width: '50vw'
          }}
        >
          <Box
            sx={{
              height: '100vh',
              width: '100%',
              margin: 0,
              padding: 0
            }}
          >
            <img
              src={RegisterImage}
              alt="Register"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: "0 90px 90px 0", // Adjusted for left side
                display: 'block',
                margin: 0
              }}
            />
          </Box>
        </Grid>

        {/* Right column - Form */}
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            pl: 10,
            '@media (max-width: 900px)': {
              width: '100%',
              height: 'auto',
              pl: 2
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              p: 2,
              width: '400px' // Fixed width as in Login.jsx
            }}
          >
            <Box sx={{ mb: 2, alignSelf: 'flex-start', ml: -1 }}>
              <img
                src={logo}
                alt="Makeup Hub Logo"
                style={{ height: '70px', width: 'auto' }}
              />
            </Box>

            <Typography component="h1" variant="h5" sx={{ mb: 3, fontStyle: "italic" }}>
              Đăng ký
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                '& .MuiTextField-root': { mb: 2, width: '100%' },
                width: '100%'
              }}
              noValidate
              autoComplete="off"
            >
              {/* Full Name Field */}
              <TextField
                required
                fullWidth
                label="Họ tên"
                name="fullName"
                value={credentials.fullName}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px'
                  }
                }}
              />

              {/* Email or Phone Field */}
              <TextField
                required
                fullWidth
                label="Email / Số điện thoại"
                name="emailOrPhone"
                value={credentials.emailOrPhone}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px'
                  }
                }}
              />

              {/* Password Field */}
              <TextField
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Confirm Password Field */}
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Nhập lại mật khẩu"
                type={showConfirmPassword ? 'text' : 'password'}
                value={credentials.confirmPassword}
                onChange={handleChange}
                variant="outlined"
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px'
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleToggleConfirmPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Terms Agreement Checkbox */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, width: '100%' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="agreeToTerms"
                      checked={credentials.agreeToTerms}
                      onChange={handleChange}
                      size="small"
                      color="primary"
                    />
                  }
                  label={<Typography variant="body2">Tôi đồng ý với các điều khoản</Typography>}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 2, py: 1.2, borderRadius: '20px' }}
              >
                Đăng ký
              </Button>

              <Box sx={{ display: 'flex', alignItems: 'center', my: 2 }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" sx={{ mx: 2, color: 'text.secondary' }}>
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
                  borderRadius: '20px',
                  textTransform: 'none',
                  borderColor: '#DADCE0',
                  color: '#3c4043',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    borderColor: '#DADCE0'
                  }
                }}
                onClick={() => console.log('Google register clicked')}
              >
                Đăng ký với Google
              </Button>

              <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                Đã có tài khoản?{' '}
                <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                  Đăng nhập ngay
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}