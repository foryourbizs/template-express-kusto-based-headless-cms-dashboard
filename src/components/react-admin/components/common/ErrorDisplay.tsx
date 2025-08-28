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
  
  // 에러 메시지를 더 상세하게 처리
  const getErrorMessage = (error: Error | string): string => {
    if (typeof error === 'string') {
      return error;
    }
    
    // React Admin에서 받은 에러 객체 처리
    if (error && typeof error === 'object') {
      const errorObj = error as any;
      
      // message 속성이 있는 경우
      if (errorObj.message) {
        return errorObj.message;
      }
      
      // status가 있는 경우
      if (errorObj.status) {
        switch (errorObj.status) {
          case 404:
            return 'API 엔드포인트를 찾을 수 없습니다. 서버 설정을 확인해주세요.';
          case 500:
            return '서버 내부 오류가 발생했습니다.';
          case 0:
            return '서버에 연결할 수 없습니다. 네트워크 연결을 확인해주세요.';
          default:
            return `서버 오류 (상태 코드: ${errorObj.status})`;
        }
      }
    }
    
    return error?.toString() || '알 수 없는 오류가 발생했습니다.';
  };
  
  const errorMessage = getErrorMessage(error);
  const errorDetails = typeof error === 'object' ? {
    stack: error.stack,
    status: (error as any).status,
    details: (error as any).details
  } : undefined;

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
        
        {errorDetails?.stack && (
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
      {errorDetails?.stack && (
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
              {errorDetails.stack}
            </Box>
          </Paper>
        </Collapse>
      )}
    </Box>
  );
};
