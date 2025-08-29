import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { useLogin, useNotify } from 'react-admin';
import { useNavigate } from 'react-router-dom';

interface ReauthModalProps {
  open: boolean;
  onClose: () => void;
  onForceLogout: () => void;
}

/**
 * 재인증 모달 컴포넌트
 * 인증이 만료되었을 때 사용자에게 재로그인을 요청
 */
export const ReauthModal: React.FC<ReauthModalProps> = ({
  open,
  onClose,
  onForceLogout,
}) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useLogin();
  const notify = useNotify();
  const navigate = useNavigate();

  // 입력값 변경 처리
  const handleInputChange = (field: 'username' | 'password') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
    // 에러 메시지 클리어
    if (error) setError(null);
  };

  // 재인증 시도
  const handleReauth = async () => {
    if (!credentials.username || !credentials.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login(credentials);
      notify('재인증이 완료되었습니다.', { type: 'success' });
      
      // 재인증 성공 후 저장된 페이지로 리다이렉트
      const redirectAfterLogin = localStorage.getItem('redirectAfterLogin');
      if (redirectAfterLogin) {
        localStorage.removeItem('redirectAfterLogin');
        navigate(redirectAfterLogin);
      }
      
      onClose();
      // 입력값 초기화
      setCredentials({ username: '', password: '' });
    } catch (err: any) {
      console.error('Reauth failed:', err);
      setError(err.message || '재인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !loading) {
      handleReauth();
    }
  };

  // 모달 닫기 시 상태 초기화
  const handleClose = () => {
    if (!loading) {
      setCredentials({ username: '', password: '' });
      setError(null);
      onClose();
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setCredentials({ username: '', password: '' });
    setError(null);
    onForceLogout();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown={loading}
      PaperProps={{
        sx: {
          borderRadius: 2,
          padding: 1,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Lock color="warning" sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h5" component="div" fontWeight={600}>
          세션이 만료되었습니다
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          계속 사용하려면 다시 로그인해주세요
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="아이디"
            value={credentials.username}
            onChange={handleInputChange('username')}
            onKeyPress={handleKeyPress}
            disabled={loading}
            autoFocus
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="비밀번호"
            type={showPassword ? 'text' : 'password'}
            value={credentials.password}
            onChange={handleInputChange('password')}
            onKeyPress={handleKeyPress}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={handleLogout}
          disabled={loading}
          color="inherit"
          sx={{ mr: 1 }}
        >
          돌아가기
        </Button>
        <Button
          onClick={handleReauth}
          variant="contained"
          disabled={loading || !credentials.username || !credentials.password}
          startIcon={loading ? <CircularProgress size={16} /> : null}
          sx={{ minWidth: 120 }}
        >
          {loading ? '인증 중...' : '재인증'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
