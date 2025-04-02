import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    InputAdornment,
    IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

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
        // Add login logic here
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                    Đăng nhập
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
                        sx={{ mt: 2, py: 1.2 }}
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
        </Container>
    );
}