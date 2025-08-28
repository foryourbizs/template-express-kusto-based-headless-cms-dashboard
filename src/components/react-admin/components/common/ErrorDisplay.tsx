import React from 'react';
import {
  Box,
  Typography,
  Button,
  Collapse,
  Paper,
  Stack,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { useNotify, useRefresh } from 'react-admin';

interface ErrorBoundaryProps {
  error: Error | string;
  resourceName?: string;
  onRetry?: () => void;
}

/**
 * React Admin 방식의 에러 표시 컴포넌트
 * useNotify와 같은 React Admin 훅을 활용
 */
export const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  error,
  resourceName,
  onRetry,
}) => {
  const [showDetails, setShowDetails] = React.useState(false);
  const notify = useNotify();
  const refresh = useRefresh();
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  const errorStack = typeof error === 'object' && error.stack ? error.stack : undefined;

  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      refresh();
    }
    notify(`${resourceName || '데이터'}를 다시 불러오는 중...`, { type: 'info' });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        p: 4,
        textAlign: 'center',
      }}
    >
      <ErrorIcon sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
      
      <Typography variant="h4" gutterBottom>
        {resourceName ? `${resourceName} 데이터 로딩 실패` : '오류가 발생했습니다'}
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 600 }}>
        {resourceName 
          ? `${resourceName} 리소스를 불러오는 중 오류가 발생했습니다: ${errorMessage}`
          : `오류가 발생했습니다: ${errorMessage}`
        }
      </Typography>
      
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleRetry}
          startIcon={<RefreshIcon />}
        >
          다시 시도
        </Button>
        
        {errorStack && (
          <Button
            variant="outlined"
            size="large"
            onClick={() => setShowDetails(!showDetails)}
            endIcon={showDetails ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          >
            {showDetails ? '세부사항 숨기기' : '세부사항 보기'}
          </Button>
        )}
      </Stack>

      {/* 세부사항 */}
      {errorStack && (
        <Collapse in={showDetails} sx={{ width: '100%', maxWidth: 800 }}>
          <Paper
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: 'rgba(0, 0, 0, 0.05)',
              borderRadius: 1,
              border: '1px solid rgba(0, 0, 0, 0.1)',
            }}
          >
            <Typography variant="subtitle2" gutterBottom>
              에러 세부사항:
            </Typography>
            <Box
              component="pre"
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.75rem',
                overflow: 'auto',
                maxHeight: '200px',
                margin: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                textAlign: 'left',
              }}
            >
              {errorStack}
            </Box>
          </Paper>
        </Collapse>
      )}
    </Box>
  );
};
