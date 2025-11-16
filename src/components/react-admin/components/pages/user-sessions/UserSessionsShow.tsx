"use client";

import { Show, SimpleShowLayout, TextField, DateField, BooleanField } from 'react-admin';

export const UserSessionsShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <TextField source="userId" label="사용자 ID" />
        <TextField source="ipAddress" label="IP 주소" />
        <TextField source="userAgent" label="User Agent" />
        <DateField source="createdAt" label="생성일시" showTime />
        <DateField source="expiresAt" label="만료일시" showTime />
        <BooleanField source="active" label="활성 상태" />
      </SimpleShowLayout>
    </Show>
  );
};
