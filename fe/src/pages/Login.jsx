import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    // Container,
    InputAdornment,
    IconButton,
    Grid
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import logo from '../assets/logo.png';
import loginImage from '../assets/login.jpeg';

export default function Login() {
    const [credentials, setCredentials] = useState({
        emailOrPhone: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login credentials:', credentials);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
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
                {/* Left column - Form */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        minWidth: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        '@media (max-width: 900px)': {
                            width: '100%',
                            height: 'auto'
                        }
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            p: 2,
                            width: '100%',
                            maxWidth: '400px'
                        }}
                    >
                        <Box sx={{ mb: 2, alignSelf: 'flex-start', ml: -1 }}>
                            <img
                                src={logo}
                                alt="Makeup Hub Logo"
                                style={{ height: '60px', width: 'auto' }}
                            />
                        </Box>

                        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                            Xin chào
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

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, py: 1.2, borderRadius: '20px' }}
                            >
                                Đăng nhập
                            </Button>

                            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
                                Chưa có tài khoản?{' '}
                                <Typography component="span" color="primary" sx={{ cursor: 'pointer' }}>
                                    Đăng ký ngay
                                </Typography>
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Right column - Image */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        minWidth: 0,
                        display: { xs: 'none', md: 'block' },
                        height: '100%',
                        marginLeft: 'auto',
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
                            src={loginImage}
                            alt="Login"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: "80px 0 0 80px",
                                display: 'block',
                                margin: 0
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}