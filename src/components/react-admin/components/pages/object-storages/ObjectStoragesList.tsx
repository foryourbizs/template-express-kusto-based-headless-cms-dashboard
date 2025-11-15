"use client";

import { List, Datagrid, TextField, DateField, BooleanField } from 'react-admin';

export const ObjectStoragesList = () => {
  return (
    <List>
      <Datagrid rowClick="edit">
        <TextField source="id" label="ID" />
        <TextField source="attributes.name" label="저장소명" />
        <TextField source="attributes.provider" label="제공자" />
        <TextField source="attributes.region" label="리전" />
        <BooleanField source="attributes.isDefault" label="기본 저장소" />
        <DateField source="attributes.createdAt" label="생성일" />
      </Datagrid>
    </List>
  );
};
