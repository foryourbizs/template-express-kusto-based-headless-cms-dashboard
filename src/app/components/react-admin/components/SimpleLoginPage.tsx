import React from 'react';
import { useState } from 'react';
import { useLogin, useNotify } from 'react-admin';
import {
    Button,
    TextField,
    Typography,
    Box,
    Container,
    Paper,
    Alert
} from '@mui/material';

const SimpleLoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const login = useLogin();
    const notify = useNotify();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ username, password });
        } catch (error: any) {
            const message = error.message || '로그인에 실패했습니다.';
            setError(message);
            notify(message, { type: 'warning' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
            <Paper sx={{ padding: 4, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom>
                    관리자 로그인
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="사용자 이름"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    
                    <TextField
                        fullWidth
                        margin="normal"
                        label="비밀번호"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={loading}
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default SimpleLoginPage;
