import React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, useAuthProvider } from 'react-admin';
import {
    Button,
    TextField,
    Typography,
    Box,
    Container,
    Paper,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email as EmailIcon,
    Lock as LockIcon
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
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc',
                py: 4
            }}
        >
            <Paper 
                elevation={0}
                sx={{
                    padding: { xs: 3, sm: 6 },
                    borderRadius: 2,
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    width: '100%',
                    maxWidth: 480,
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    {/* 브랜드 로고 영역 */}
                    <Box
                        sx={{
                            width: 120,
                            height: 60,
                            backgroundColor: '#f1f5f9',
                            border: '2px dashed #cbd5e1',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 4,
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                                backgroundColor: '#e2e8f0',
                                borderColor: '#94a3b8'
                            }
                        }}
                    >
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                                fontSize: '0.75rem',
                                textAlign: 'center',
                                px: 1
                            }}
                        >
                            브랜드 로고
                        </Typography>
                    </Box>

                    <Typography 
                        component="h1" 
                        variant="h4" 
                        sx={{ 
                            fontWeight: 600,
                            color: '#1e293b',
                            mb: 1,
                            fontSize: { xs: '1.75rem', sm: '2rem' }
                        }}
                    >
                        로그인
                    </Typography>

                    <Typography 
                        variant="body1" 
                        color="text.secondary" 
                        align="center"
                        sx={{ 
                            mb: 4,
                            fontSize: '0.95rem',
                            lineHeight: 1.5
                        }}
                    >
                        계정에 로그인하여 시스템에 액세스하세요
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
                            label="이메일 또는 사용자명"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ 
                                mb: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    backgroundColor: '#f8fafc',
                                    '& fieldset': {
                                        borderColor: '#e2e8f0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#cbd5e1',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3b82f6',
                                        borderWidth: 2,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    '&.Mui-focused': {
                                        color: '#3b82f6',
                                    },
                                },
                            }}
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
                                        <LockIcon sx={{ color: '#94a3b8', fontSize: '1.1rem' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ color: '#94a3b8' }}
                                        >
                                            {showPassword ? <VisibilityOff sx={{ fontSize: '1.1rem' }} /> : <Visibility sx={{ fontSize: '1.1rem' }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 1.5,
                                    backgroundColor: '#f8fafc',
                                    '& fieldset': {
                                        borderColor: '#e2e8f0',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#cbd5e1',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#3b82f6',
                                        borderWidth: 2,
                                    },
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#64748b',
                                    '&.Mui-focused': {
                                        color: '#3b82f6',
                                    },
                                },
                            }}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ 
                                mt: 2, 
                                mb: 3, 
                                py: 1.5,
                                borderRadius: 1.5,
                                fontSize: '1rem',
                                fontWeight: 600,
                                backgroundColor: '#3b82f6',
                                textTransform: 'none',
                                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                '&:hover': {
                                    backgroundColor: '#2563eb',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                },
                                '&:disabled': {
                                    backgroundColor: '#94a3b8',
                                    color: 'white',
                                }
                            }}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ textAlign: 'center' }}>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{ fontSize: '0.875rem' }}
                            >
                                © 2025 All rights reserved.
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default CustomLoginPage;
