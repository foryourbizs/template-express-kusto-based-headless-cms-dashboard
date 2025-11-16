"use client";

import { TextField, DateField, NumberField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const FilesList = () => {
  return (
    <GenericList
      queryOptions={{
				meta: {
					include: ['storage']
				}
      }}
      columns={[
        <TextField key="id" source="id" label="ID" />,
        <TextField key="filename" source="filename" label="파일명" />,
        <TextField key="mimeType" source="mimeType" label="MIME 타입" />,
        <NumberField key="fileSize" source="fileSize" label="크기 (bytes)" />,
        <TextField key="storageName" source="storage.name" label="저장소 이름" />,
        <DateField key="createdAt" source="createdAt" label="업로드일" showTime />,
      ]}
      defaultSort={{ field: 'createdAt', order: 'DESC' }}
      rowClick="show"
      perPage={25}
    />
  );
};
