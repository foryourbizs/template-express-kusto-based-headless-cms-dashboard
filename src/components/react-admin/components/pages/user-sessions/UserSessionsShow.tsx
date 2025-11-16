"use client";

import { Show, TextField, DateField, BooleanField, Labeled } from 'react-admin';
import { Box, Stack, Paper, Typography, Divider } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import LinkIcon from '@mui/icons-material/Link';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DevicesIcon from '@mui/icons-material/Devices';
import SecurityIcon from '@mui/icons-material/Security';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';

const SectionTitle = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
    {icon}
    <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
      {children}
    </Typography>
  </Box>
);

export const UserSessionsShow = () => {
  return (
    <Show>
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 2 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            사용자 세션 상세 정보
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {/* 기본 식별자 */}
          <SectionTitle icon={<InfoIcon color="primary" />}>기본 식별자</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="세션 PK (id)">
                <TextField source="id" />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="세션 UUID (uuid)">
                <TextField source="uuid" />
              </Labeled>
            </Box>
          </Stack>

          {/* 연결 관계 */}
          <SectionTitle icon={<LinkIcon color="primary" />}>연결 관계</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="사용자 UUID">
                <TextField source="userUuid" />
              </Labeled>
            </Box>
          </Stack>

          {/* 토큰 식별자 */}
          <SectionTitle icon={<VpnKeyIcon color="primary" />}>토큰 식별자</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="액세스 토큰 JTI">
                <TextField source="jti" />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="리프레시 토큰 JTI">
                <TextField source="refreshJti" />
              </Labeled>
            </Box>
          </Stack>

          {/* 토큰 패밀리 관리 */}
          <SectionTitle icon={<VpnKeyIcon color="primary" />}>토큰 패밀리 관리</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="토큰 패밀리 ID">
                <TextField source="familyId" />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="토큰 세대 번호">
                <TextField source="generation" />
              </Labeled>
            </Box>
          </Stack>

          {/* 세션 정보 */}
          <SectionTitle icon={<DevicesIcon color="primary" />}>세션 정보</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="디바이스 정보">
                <TextField source="deviceInfo" />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="디바이스 ID">
                <TextField source="deviceId" />
              </Labeled>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="IP 주소">
                <TextField source="ipAddress" />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="지리적 위치 정보">
                <TextField source="location" />
              </Labeled>
            </Box>
          </Stack>

          {/* 세션 상태 */}
          <SectionTitle icon={<SecurityIcon color="primary" />}>세션 상태</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="세션 활성화 상태">
                <BooleanField source="isActive" />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="보안 위험 감지 상태">
                <BooleanField source="isCompromised" />
              </Labeled>
            </Box>
          </Stack>

          {/* 시간 관리 */}
          <SectionTitle icon={<AccessTimeIcon color="primary" />}>시간 관리</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="마지막 사용 시간">
                <DateField source="lastUsedAt" showTime />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="세션 만료 시간">
                <DateField source="expiresAt" showTime />
              </Labeled>
            </Box>
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="액세스 토큰 만료 시간">
                <DateField source="accessTokenExpiresAt" showTime />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="리프레시 토큰 만료 시간">
                <DateField source="refreshTokenExpiresAt" showTime />
              </Labeled>
            </Box>
          </Stack>

          {/* 보안 메타데이터 */}
          <SectionTitle icon={<VerifiedUserIcon color="primary" />}>보안 메타데이터</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="로그인 방법">
                <TextField source="loginMethod" />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
              <Labeled label="세션 신뢰도 점수">
                <TextField source="trustScore" />
              </Labeled>
            </Box>
          </Stack>

          {/* 소프트 삭제 */}
          <SectionTitle icon={<DeleteIcon color="primary" />}>소프트 삭제</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="삭제 시간">
                <DateField source="deletedAt" showTime />
              </Labeled>
            </Box>
          </Stack>

          {/* 감사 추적 */}
          <SectionTitle icon={<HistoryIcon color="primary" />}>감사 추적</SectionTitle>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Box sx={{ flex: 1 }}>
              <Labeled label="세션 생성 시간">
                <DateField source="createdAt" showTime />
              </Labeled>
            </Box>
            <Box sx={{ flex: 1 }}>
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
