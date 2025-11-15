"use client";

import { List, Datagrid, TextField, DateField, NumberField, ImageField } from 'react-admin';

export const FilesList = () => {
  return (
    <List>
      <Datagrid rowClick="show">
        <TextField source="id" label="ID" />
        <TextField source="attributes.filename" label="파일명" />
        <TextField source="attributes.mimetype" label="MIME 타입" />
        <NumberField source="attributes.size" label="크기 (bytes)" />
        <TextField source="attributes.storageId" label="저장소 ID" />
        <DateField source="attributes.createdAt" label="업로드일" showTime />
      </Datagrid>
    </List>
  );
};
