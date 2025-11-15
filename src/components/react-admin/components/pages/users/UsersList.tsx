"use client";

import { List, Datagrid, TextField, EmailField, DateField } from 'react-admin';

export const UsersList = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="username" label="사용자명" />
        <EmailField source="email" label="이메일" />
        <DateField source="createdAt" label="생성일" />
      </Datagrid>
    </List>
  );
};
