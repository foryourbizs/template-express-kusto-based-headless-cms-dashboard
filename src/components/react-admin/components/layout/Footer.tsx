import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';

/**
 * 푸터 컴포넌트
 * 저작권 정보와 링크들을 포함
 */
export const Footer: React.FC = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        left: 0,
        zIndex: theme.zIndex.appBar - 1,
        backgroundColor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: 1,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        {/* 저작권 정보 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: '0.75rem' }}
        >
          © {currentYear} Admin Panel. All rights reserved.
        </Typography>

        {/* 링크들 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Link
            href="#"
            variant="body2"
            color="text.secondary"
            underline="hover"
            sx={{ fontSize: '0.75rem' }}
          >
            도움말
          </Link>
          <Link
            href="#"
            variant="body2"
            color="text.secondary"
            underline="hover"
            sx={{ fontSize: '0.75rem' }}
          >
            개인정보처리방침
          </Link>
          <Link
            href="#"
            variant="body2"
            color="text.secondary"
            underline="hover"
            sx={{ fontSize: '0.75rem' }}
          >
            이용약관
          </Link>
        </Box>
      </Box>
    </Box>
  );
};
