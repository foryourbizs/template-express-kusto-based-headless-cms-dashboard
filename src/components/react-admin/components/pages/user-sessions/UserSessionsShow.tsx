"use client";

import { Show, SimpleShowLayout, TextField, DateField, BooleanField } from 'react-admin';

export const UserSessionsShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
  <TextField source="id" label="세션 PK (id)" />
  <TextField source="uuid" label="세션 UUID (uuid)" />
  <TextField source="userUuid" label="사용자 UUID" />
  <TextField source="jti" label="액세스 토큰 JTI" />
  <TextField source="refreshJti" label="리프레시 토큰 JTI" />
  <TextField source="familyId" label="토큰 패밀리 ID" />
  <TextField source="generation" label="토큰 세대 번호" />
  <TextField source="deviceInfo" label="디바이스 정보" />
  <TextField source="deviceId" label="디바이스 ID" />
  <TextField source="ipAddress" label="IP 주소" />
  <TextField source="location" label="지리적 위치 정보" />
  <BooleanField source="isActive" label="세션 활성화 상태" />
  <BooleanField source="isCompromised" label="보안 위험 감지 상태" />
  <DateField source="lastUsedAt" label="마지막 사용 시간" showTime />
  <DateField source="expiresAt" label="세션 만료 시간" showTime />
  <DateField source="accessTokenExpiresAt" label="액세스 토큰 만료 시간" showTime />
  <DateField source="refreshTokenExpiresAt" label="리프레시 토큰 만료 시간" showTime />
  <TextField source="loginMethod" label="로그인 방법" />
  <TextField source="trustScore" label="세션 신뢰도 점수" />
  <DateField source="deletedAt" label="삭제 시간" showTime />
  <DateField source="createdAt" label="세션 생성 시간" showTime />
  <DateField source="updatedAt" label="마지막 업데이트 시간" showTime />
      </SimpleShowLayout>
    </Show>
  );
};
