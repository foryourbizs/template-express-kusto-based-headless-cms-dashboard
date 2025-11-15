"use client";

import { Show, SimpleShowLayout, TextField, EmailField, DateField } from 'react-admin';

export const UsersShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <TextField source="username" label="사용자명" />
        <EmailField source="email" label="이메일" />
        <DateField source="createdAt" label="생성일" showTime />
        <DateField source="updatedAt" label="수정일" showTime />
      </SimpleShowLayout>
    </Show>
  );
};
