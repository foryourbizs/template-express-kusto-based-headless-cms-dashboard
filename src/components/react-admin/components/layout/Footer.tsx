import React from 'react';
import { Box, Typography, Link, useTheme } from '@mui/material';
import { useThemeMode } from '../../AdminApp';

/**
 * 푸터 컴포넌트
 * 저작권 정보와 링크들을 포함
 * 모바일에서 겹침 문제를 해결하기 위해 sticky 대신 flexbox 레이아웃 사용
 */
export const Footer: React.FC = () => {
  const theme = useTheme();
  const { darkMode } = useThemeMode();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto', // flexbox로 하단에 자동 배치
        backgroundColor: darkMode ? '#1e1e1e' : theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        py: { xs: 1.5, sm: 1 }, // 모바일에서 더 큰 패딩
        px: { xs: 1, sm: 2 },
        flexShrink: 0, // 축소되지 않도록 설정
        transition: 'background-color 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: { xs: 1, sm: 2 },
          flexDirection: { xs: 'column', sm: 'row' }, // 모바일에서 세로 정렬
        }}
      >
        {/* 저작권 정보 */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ 
            fontSize: '0.75rem',
            textAlign: { xs: 'center', sm: 'left' } // 모바일에서 중앙 정렬
          }}
        >
          © {currentYear} Foryourbizs Panel. All rights reserved.
        </Typography>

        {/* 링크들 */}
        <Box 
          sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            flexWrap: 'wrap',
            justifyContent: { xs: 'center', sm: 'flex-end' } // 모바일에서 중앙 정렬
          }}
        >
          <Link
            href="https://dx-fujifilm.com"
            variant="body2"
            color="text.secondary"
            underline="hover"
            target='_homepage'
            sx={{ fontSize: '0.75rem' }}
          >
            홈페이지
          </Link>
        </Box>
      </Box>
    </Box>
  );
};