"use client";

import { Show, SimpleShowLayout, TextField, DateField, BooleanField } from 'react-admin';

export const ObjectStoragesShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <TextField source="attributes.name" label="저장소명" />
        <TextField source="attributes.provider" label="제공자" />
        <TextField source="attributes.region" label="리전" />
        <TextField source="attributes.bucket" label="버킷명" />
        <BooleanField source="attributes.isDefault" label="기본 저장소" />
        <DateField source="attributes.createdAt" label="생성일시" showTime />
        <DateField source="attributes.updatedAt" label="수정일시" showTime />
      </SimpleShowLayout>
    </Show>
  );
};
