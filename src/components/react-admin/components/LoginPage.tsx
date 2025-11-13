import React from 'react';
import { useState } from 'react';
import Image from 'next/image';
import authProvider, { LoginCredentials } from '../lib/authProvider';
import {
    Button,
    TextField,
    Typography,
    Box,
    Container,
    Paper,
    InputAdornment,
    IconButton,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Email as EmailIcon,
    Lock as LockIcon
} from '@mui/icons-material';

const CustomLoginPage = () => {
    const [loginForm, setLoginForm] = useState<LoginCredentials>({
        username: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // authProvider의 login 직접 호출 (타입 안전한 LoginCredentials 사용)
            await authProvider.login(loginForm);
            
            // 로그인 성공 후 페이지 새로고침하여 인증 상태 재확인
            const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
            if (redirectAfterLogin && redirectAfterLogin !== '/login') {
                localStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectAfterLogin;
            } else {
                window.location.href = '/';
            }
        } catch (error) {
            setError('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            setLoading(false);
        }
    };

    const handleCloseError = () => {
        setError(null);
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 2,
                        }}
                    >
                        <Typography 
                            className='fixed -indent-[9999px] opacity-0'
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
                        <Image src="/assets/fuji_b_cmp.webp" alt="Brand Logo" priority width={120} height={60} />
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
                        대시보드 로그인
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
                        계정에 로그인하여 관리 시스템에 액세스하세요
                    </Typography>

                    <Box 
                        component="form" 
                        onSubmit={handleSubmit} 
                        autoComplete="off"
                        sx={{ width: '100%' }}
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="login_user"
                            label="이메일 또는 아이디"
                            name="login_user"
                            autoComplete="off"
                            autoFocus
                            value={loginForm.username}
                            autoCapitalize='off'
                            aria-autocomplete='none'
                            autoSave='off'
                            autoCorrect='off'
                            onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <EmailIcon sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ 
                                mb: 3,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#ffffff',
                                    height: '56px',
                                    transition: 'all 0.2s ease-in-out',
                                    '& fieldset': {
                                        borderColor: '#d1d5db',
                                        borderWidth: '1px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#9ca3af',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#50a48c',
                                        borderWidth: '2px',
                                    },
                                    '& input': {
                                        fontSize: '1rem',
                                        color: '#1f2937',
                                        padding: '16px 14px',
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#6b7280',
                                    fontSize: '1rem',
                                    '&.Mui-focused': {
                                        color: '#50a48c',
                                    },
                                    '&.MuiInputLabel-shrink': {
                                        fontSize: '0.875rem',
                                    }
                                },
                            }}
                        />
                        
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="login_pass"
                            label="비밀번호"
                            autoCapitalize='off'
                            aria-autocomplete='none'
                            type="text"
                            id="login_pass"
                            autoComplete="off"
                            value={loginForm.password}
                            onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon sx={{ color: '#6b7280', fontSize: '1.2rem' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={handleClickShowPassword}
                                            edge="end"
                                            sx={{ 
                                                color: '#6b7280',
                                                '&:hover': {
                                                    backgroundColor: '#f3f4f6',
                                                    color: '#374151'
                                                }
                                            }}
                                        >
                                            {showPassword ? <VisibilityOff sx={{ fontSize: '1.2rem' }} /> : <Visibility sx={{ fontSize: '1.2rem' }} />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ 
                                mb: 4,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    backgroundColor: '#ffffff',
                                    height: '56px',
                                    transition: 'all 0.2s ease-in-out',
                                    '& fieldset': {
                                        borderColor: '#d1d5db',
                                        borderWidth: '1px',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: '#9ca3af',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#50a48c',
                                        borderWidth: '2px',
                                    },
                                    '& input': {
                                        fontSize: '1rem',
                                        color: '#1f2937',
                                        padding: '16px 14px',
                                        WebkitTextSecurity: showPassword ? 'none' : 'disc',
                                        textSecurity: showPassword ? 'none' : 'disc',
                                        fontFamily: showPassword ? 'inherit' : 'text-security-disc'
                                    }
                                },
                                '& .MuiInputLabel-root': {
                                    color: '#6b7280',
                                    fontSize: '1rem',
                                    '&.Mui-focused': {
                                        color: '#50a48c',
                                    },
                                    '&.MuiInputLabel-shrink': {
                                        fontSize: '0.875rem',
                                    }
                                },
                            }}
                        />
                        
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ 
                                mt: 1, 
                                mb: 3, 
                                py: 2,
                                borderRadius: 2,
                                fontSize: '1rem',
                                fontWeight: 600,
                                backgroundColor: '#50a48c',
                                textTransform: 'none',
                                height: '56px',
                                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                                transition: 'all 0.2s ease-in-out',
                                '&:hover': {
                                    backgroundColor: '#3d8b73',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                                    transform: 'translateY(-1px)',
                                },
                                '&:active': {
                                    transform: 'translateY(0px)',
                                },
                                '&:disabled': {
                                    backgroundColor: '#9ca3af',
                                    color: 'white',
                                    transform: 'none',
                                }
                            }}
                        >
                            {loading ? '로그인 중...' : '로그인'}
                        </Button>

                    </Box>
                </Box>
            </Paper>

            {/* 에러 메시지 Snackbar */}
            <Snackbar
                open={!!error}
                autoHideDuration={6000}
                onClose={handleCloseError}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseError} 
                    severity="error" 
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {error}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CustomLoginPage;
