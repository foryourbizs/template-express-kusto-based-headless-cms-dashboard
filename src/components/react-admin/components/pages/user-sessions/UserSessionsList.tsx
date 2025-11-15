"use client";

import { List, Datagrid, TextField, DateField, BooleanField } from 'react-admin';

export const UserSessionsList = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="attributes.userId" label="사용자 ID" />
        <TextField source="attributes.ipAddress" label="IP 주소" />
        <DateField source="attributes.createdAt" label="생성일시" showTime />
        <DateField source="attributes.expiresAt" label="만료일시" showTime />
        <BooleanField source="attributes.active" label="활성" />
      </Datagrid>
    </List>
  );
};
