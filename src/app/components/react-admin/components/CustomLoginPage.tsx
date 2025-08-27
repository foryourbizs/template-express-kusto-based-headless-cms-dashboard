import React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, useAuthProvider } from 'react-admin';
import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    TextField,
    Typography,
    Box,
    Container,
    Paper,
    InputAdornment,
    IconButton
} from '@mui/material';
import {
    LockOutlined as LockIcon,
    Visibility,
    VisibilityOff,
    Person as PersonIcon
} from '@mui/icons-material';

const CustomLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await login({ username, password });
        } catch (error) {
            notify('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.', { type: 'warning' });
        } finally {
            setLoading(false);
        }
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container 
            component="main" 
            maxWidth="sm"
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
        >
            <Paper 
                elevation={6}
                sx={{
                    padding: 4,
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    width: '100%',
                    maxWidth: 400
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar 
                        sx={{ 
                            m: 1, 
                            bgcolor: 'primary.main',
                            width: 56,
                            height: 56
                        }}
                    >
                        <LockIcon fontSize="large" />
                    </Avatar>
                    
                    <Typography 
                        component="h1" 
                        variant="h4" 
                        gutterBottom
                        sx={{ 
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mb: 3
                        }}
                    >
                        관리자 로그인
                    </Typography>

                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        관리자 계정으로 로그인하여 시스템을 관리하세요.
                    </Typography>

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="사용자 이름"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 2 }}
                        />
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="비밀번호"
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ mb: 3 }}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ 
                                mt: 2, 
                                mb: 2, 
                                py: 1.5,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #FE5B7B 30%, #FF7E43 90%)',
                                }
                            }}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>

                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                © 2025 관리자 시스템. All rights reserved.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CustomLoginPage;
