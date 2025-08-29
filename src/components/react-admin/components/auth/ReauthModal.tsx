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
  CircularProgress,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useAuthProvider, useNotify, useRedirect } from 'react-admin';

interface ReauthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  reason?: string;
}

export const ReauthModal: React.FC<ReauthModalProps> = ({
  open,
  onClose,
  onSuccess,
  reason = '인증이 만료되었습니다.'
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const authProvider = useAuthProvider();
  const notify = useNotify();
  const redirect = useRedirect();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (!authProvider) {
      setError('인증 서비스를 사용할 수 없습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authProvider.login({ username, password });
      
      // 성공 시
      notify('재인증이 완료되었습니다.', { type: 'success' });
      onSuccess();
      handleClose();
    } catch (err) {
      console.error('Reauth error:', err);
      setError(err instanceof Error ? err.message : '재인증에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    setError('');
    setLoading(false);
    onClose();
  };

  const handleLogout = () => {
    if (authProvider) {
      authProvider.logout({});
    }
    redirect('/login');
    handleClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Typography variant="h6" component="div">
          재인증 필요
        </Typography>
        <IconButton
          aria-label="close"
          onClick={handleLogout}
          sx={{ color: (theme) => theme.palette.grey[500] }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Alert severity="warning" sx={{ mb: 3 }}>
              {reason} 계속하려면 다시 로그인해주세요.
            </Alert>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              autoFocus
              margin="normal"
              variant="outlined"
            />

            <TextField
              fullWidth
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              margin="normal"
              variant="outlined"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleLogout}
            disabled={loading}
            color="inherit"
          >
            로그아웃
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !username || !password}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? '로그인 중...' : '로그인'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
