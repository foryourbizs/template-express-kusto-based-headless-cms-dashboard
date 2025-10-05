import React from 'react';
import { List, Datagrid, TextField, EmailField, BooleanField } from 'react-admin';

export const UserListSimple = () => (
    <List title="사용자 관리 (단순 버전)">
        <Datagrid rowClick="edit">
            <TextField source="id" label="ID" />
            <TextField source="username" label="사용자명" />
            <TextField source="name" label="이름" />
            <EmailField source="email" label="이메일" />
            <BooleanField source="isActive" label="활성" />
            <TextField source="status" label="상태" />
        </Datagrid>
    </List>
);

export default UserListSimple;