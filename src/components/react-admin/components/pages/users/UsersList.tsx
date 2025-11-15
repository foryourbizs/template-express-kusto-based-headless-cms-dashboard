"use client";

import { List, Datagrid, TextField, EmailField, DateField } from 'react-admin';

export const UsersList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" label="ID" />
        <TextField source="attributes.username" label="사용자명" />
        <EmailField source="attributes.email" label="이메일" />
        <DateField source="attributes.createdAt" label="생성일" />
      </Datagrid>
    </List>
  );
};
