"use client";

import { Show, TextField, DateField, BooleanField, Labeled, useRecordContext, useRedirect } from 'react-admin';
import { Box, Stack, Paper, Typography, Divider, Popover, Button, Chip } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useState } from 'react';

const SectionTitle = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <Box 
    sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      mb: 2.5, 
      mt: 3,
      pb: 1,
      borderBottom: '2px solid',
      borderColor: 'primary.main',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        bottom: -2,
        left: 0,
        width: '60px',
        height: '2px',
        backgroundColor: 'primary.light',
      }
    }}
  >
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        width: 36,
        height: 36,
        borderRadius: '8px',
        backgroundColor: 'primary.main',
        color: 'white',
        mr: 1.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
      }}
    >
      {icon}
    </Box>
    <Typography variant="h6" fontWeight={600} color="text.primary" letterSpacing={0.5}>
      {children}
    </Typography>
  </Box>
);

const UserUuidField = () => {
  const record = useRecordContext();
  const redirect = useRedirect();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!record) return null;

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleNavigate = () => {
    redirect('show', 'privates/users', record.userUuid);
    handlePopoverClose();
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <Box
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        onClick={handleNavigate}
        sx={{ 
          cursor: 'pointer',
          display: 'inline-block',
          '&:hover': {
            textDecoration: 'underline'
          }
        }}
      >
        <TextField source="userUuid" />
      </Box>
      <Popover
        sx={{
          pointerEvents: 'none',
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
        slotProps={{
          paper: {
            sx: {
              pointerEvents: 'auto',
              p: 2.5,
              mt: 1,
              maxWidth: 320,
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              border: '1px solid',
              borderColor: 'divider'
            },
            onMouseEnter: handlePopoverOpen,
            onMouseLeave: handlePopoverClose,
          }
        }}
      >
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pb: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: '10px',
              backgroundColor: 'primary.main',
              color: 'white',
            }}>
              <PersonIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={600}>
                사용자 정보
              </Typography>
              <Typography variant="caption" color="text.secondary">
                클릭하여 상세 정보 보기
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                UUID
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ 
                wordBreak: 'break-all',
                fontSize: '0.813rem'
              }}>
                {record.userUuid}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                사용자명
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ 
                wordBreak: 'break-all',
                fontSize: '0.813rem'
              }}>
                {record.user?.username || 'N/A'}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Stack spacing={1.5}>
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                이메일
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.813rem' }}>
                {record.user?.email || 'N/A'}
              </Typography>
            </Box>

            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary" display="block">
                  타임존
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.813rem' }}>
                  {record.user?.timezone || 'N/A'}
                </Typography>
              </Box>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary" display="block">
                  언어
                </Typography>
                <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.813rem' }}>
                  {record.user?.locale || 'N/A'}
                </Typography>
              </Box>
            </Stack>

            <Divider />

            <Box>
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                계정 상태
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip 
                  label={record.user?.isActive ? '활성' : '비활성'} 
                  size="small" 
                  variant={record.user?.isActive ? 'filled' : 'outlined'}
                  color={record.user?.isActive ? 'success' : 'default'}
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: 24,
                    ...(!record.user?.isActive && {
                      borderWidth: 1.5,
                      borderColor: 'action.disabled'
                    })
                  }}
                />
                <Chip 
                  label={record.user?.isVerified ? '인증됨' : '미인증'} 
                  size="small" 
                  variant={record.user?.isVerified ? 'filled' : 'outlined'}
                  color={record.user?.isVerified ? 'primary' : 'default'}
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: 24,
                    ...(!record.user?.isVerified && {
                      borderWidth: 1.5,
                      borderColor: 'action.disabled'
                    })
                  }}
                />
                <Chip 
                  label={record.user?.isSuspended ? '정지됨' : '정상'} 
                  size="small" 
                  variant={record.user?.isSuspended ? 'filled' : 'outlined'}
                  color={record.user?.isSuspended ? 'error' : 'success'}
                  sx={{ 
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    height: 24,
                    ...(!record.user?.isSuspended && {
                      borderWidth: 1.5,
                      borderColor: 'success.main'
                    })
                  }}
                />
              </Stack>
            </Box>

            <Divider />

            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                마지막 로그인
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.813rem' }}>
                {record.user?.lastLoginAt 
                  ? new Date(record.user.lastLoginAt).toLocaleString('ko-KR') 
                  : 'N/A'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                마지막 로그인 IP
              </Typography>
              <Typography variant="body2" fontWeight={500} sx={{ fontSize: '0.813rem' }}>
                {record.user?.lastLoginIp || 'N/A'}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Popover>
    </>
  );
};

export const UserSessionsShow = () => {
  return (
    <Show queryOptions={{ meta: { include: ['user'] } }}>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            backgroundColor: 'background.paper'
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h4" 
              fontWeight={700} 
              gutterBottom 
              sx={{ 
                color: 'text.primary',
                letterSpacing: '-0.5px',
                mb: 1
              }}
            >
              사용자 세션 상세 정보
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              세션의 모든 정보를 확인하고 관리할 수 있습니다.
            </Typography>
            <Divider sx={{ borderColor: 'divider' }} />
          </Box>

          {/* 기본 식별자 */}
          <SectionTitle icon={<InfoIcon fontSize="small" />}>기본 식별자</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="세션 ID (UUID)">
                <TextField source="id" />
              </Labeled>
            </Box>
          </Stack>

          {/* 연결 관계 */}
          <SectionTitle icon={<LinkIcon fontSize="small" />}>연결 관계</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="사용자 UUID">
                <UserUuidField />
              </Labeled>
            </Box>
          </Stack>

          {/* 토큰 식별자 */}
          <SectionTitle icon={<VpnKeyIcon fontSize="small" />}>토큰 식별자</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="액세스 토큰 JTI">
                <TextField source="jti" />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="리프레시 토큰 JTI">
                <TextField source="refreshJti" />
              </Labeled>
            </Box>
          </Stack>

          {/* 토큰 패밀리 관리 */}
          <SectionTitle icon={<VpnKeyIcon fontSize="small" />}>토큰 패밀리 관리</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="토큰 패밀리 ID">
                <TextField source="familyId" />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="토큰 세대 번호">
                <TextField source="generation" />
              </Labeled>
            </Box>
          </Stack>

          {/* 세션 정보 */}
          <SectionTitle icon={<DevicesIcon fontSize="small" />}>세션 정보</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="디바이스 정보">
                <TextField source="deviceInfo" />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="디바이스 ID">
                <TextField source="deviceId" />
              </Labeled>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="IP 주소">
                <TextField source="ipAddress" />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="지리적 위치 정보">
                <TextField source="location" />
              </Labeled>
            </Box>
          </Stack>

          {/* 세션 상태 */}
          <SectionTitle icon={<SecurityIcon fontSize="small" />}>세션 상태</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="세션 활성화 상태">
                <BooleanField source="isActive" />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="보안 위험 감지 상태">
                <BooleanField source="isCompromised" />
              </Labeled>
            </Box>
          </Stack>

          {/* 시간 관리 */}
          <SectionTitle icon={<AccessTimeIcon fontSize="small" />}>시간 관리</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="마지막 사용 시간">
                <DateField source="lastUsedAt" showTime />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="세션 만료 시간">
                <DateField source="expiresAt" showTime />
              </Labeled>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="액세스 토큰 만료 시간">
                <DateField source="accessTokenExpiresAt" showTime />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="리프레시 토큰 만료 시간">
                <DateField source="refreshTokenExpiresAt" showTime />
              </Labeled>
            </Box>
          </Stack>

          {/* 보안 메타데이터 */}
          <SectionTitle icon={<VerifiedUserIcon fontSize="small" />}>보안 메타데이터</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="로그인 방법">
                <TextField source="loginMethod" />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="세션 신뢰도 점수">
                <TextField source="trustScore" />
              </Labeled>
            </Box>
          </Stack>

          {/* 소프트 삭제 */}
          <SectionTitle icon={<DeleteIcon fontSize="small" />}>소프트 삭제</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="삭제 시간">
                <DateField source="deletedAt" showTime />
              </Labeled>
            </Box>
          </Stack>

          {/* 감사 추적 */}
          <SectionTitle icon={<HistoryIcon fontSize="small" />}>감사 추적</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="세션 생성 시간">
                <DateField source="createdAt" showTime />
              </Labeled>
            </Box>
            <Box sx={{ 
              flex: 1, 
              p: 2, 
              borderRadius: 2, 
              backgroundColor: 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
              transition: 'all 0.2s',
              '&:hover': {
                backgroundColor: 'action.selected',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }
            }}>
              <Labeled label="마지막 업데이트 시간">
                <DateField source="updatedAt" showTime />
              </Labeled>
            </Box>
          </Stack>
        </Paper>
      </Box>
    </Show>
  );
};
