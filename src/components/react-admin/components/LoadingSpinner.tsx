import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useThemeMode } from '../AdminApp';

interface LoadingSpinnerProps {
  open: boolean;
  message?: string;
}

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

/**
 * 글로벌 로딩 스피너 컴포넌트
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  open, 
  message = '로딩 중...' 
}) => {
  const theme = useTheme();
  const { darkMode } = useThemeMode();

  return (
    <Backdrop 
      open={open}
      sx={{
        zIndex: theme.zIndex.modal + 1,
        backgroundColor: darkMode 
          ? 'rgba(0, 0, 0, 0.2)' 
          : 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        transition: 'background-color 0.3s ease',
      }}
    >
      <LoadingContainer>
        <CircularProgress
          size={48}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
          }}
        />
        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 500,
          }}
        >
          {message}
        </Typography>
      </LoadingContainer>
    </Backdrop>
  );
};
