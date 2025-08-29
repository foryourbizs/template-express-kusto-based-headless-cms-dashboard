import React from 'react';
import {
  Backdrop,
  CircularProgress,
  Box,
  Typography,
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface LoadingSpinnerProps {
  open: boolean;
  message?: string;
}

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.modal + 1,
  backgroundColor: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(2px)',
}));

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

  return (
    <StyledBackdrop open={open}>
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
    </StyledBackdrop>
  );
};
