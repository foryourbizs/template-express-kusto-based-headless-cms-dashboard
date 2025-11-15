"use client";

import { Show, SimpleShowLayout, TextField, DateField, BooleanField } from 'react-admin';

export const UserSessionsShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <TextField source="attributes.userId" label="사용자 ID" />
        <TextField source="attributes.ipAddress" label="IP 주소" />
        <TextField source="attributes.userAgent" label="User Agent" />
        <DateField source="attributes.createdAt" label="생성일시" showTime />
        <DateField source="attributes.expiresAt" label="만료일시" showTime />
        <BooleanField source="attributes.active" label="활성 상태" />
      </SimpleShowLayout>
    </Show>
  );
};
