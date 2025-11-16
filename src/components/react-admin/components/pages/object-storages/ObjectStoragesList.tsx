"use client";

import { TextField, DateField, BooleanField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const ObjectStoragesList = () => {
  return (
    <GenericList
      columns={[
        <TextField key="id" source="id" label="ID" />,
        <TextField key="name" source="name" label="저장소명" />,
        <TextField key="provider" source="provider" label="제공자" />,
        <TextField key="region" source="region" label="리전" />,
        <BooleanField key="isDefault" source="isDefault" label="기본 저장소" />,
        <DateField key="createdAt" source="createdAt" label="생성일" />,
      ]}
      defaultSort={{ field: 'createdAt', order: 'DESC' }}
      rowClick="show"
      perPage={25}
    />
  );
};
