"use client";

import { Show, SimpleShowLayout, TextField, DateField, NumberField, ImageField, UrlField } from 'react-admin';

export const FilesShow = () => {
  return (
    <Show>
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <TextField source="attributes.filename" label="파일명" />
        <TextField source="attributes.mimetype" label="MIME 타입" />
        <NumberField source="attributes.size" label="크기 (bytes)" />
        <TextField source="attributes.storageId" label="저장소 ID" />
        <UrlField source="attributes.url" label="URL" target="_blank" />
        <TextField source="attributes.description" label="설명" />
        <TextField source="attributes.tags" label="태그" />
        <DateField source="attributes.createdAt" label="업로드일시" showTime />
        <DateField source="attributes.updatedAt" label="수정일시" showTime />
      </SimpleShowLayout>
    </Show>
  );
};
