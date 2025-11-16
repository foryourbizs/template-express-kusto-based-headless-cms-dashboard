"use client";

import { TextField, DateField, NumberField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const FilesList = () => {
  return (
    <GenericList
      columns={[
        <TextField key="id" source="id" label="ID" />,
        <TextField key="filename" source="filename" label="파일명" />,
        <TextField key="mimetype" source="mimetype" label="MIME 타입" />,
        <NumberField key="size" source="size" label="크기 (bytes)" />,
        <TextField key="storageId" source="storageId" label="저장소 ID" />,
        <DateField key="createdAt" source="createdAt" label="업로드일" showTime />,
      ]}
      defaultSort={{ field: 'createdAt', order: 'DESC' }}
      rowClick="show"
      perPage={25}
    />
  );
};
