"use client";

import { TextField, DateField, NumberField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const TermList = () => {
  return (
    <GenericList
      queryOptions={{
        meta: {
          include: ['taxonomies']
        }
      }}
      columns={[
        <TextField key="id" source="id" label="ID" />,

        <TextField key="name" source="name" label="분류 명" />,
        <TextField key="slug" source="slug" label="슬러그" />,

        <DateField key="createdAt" source="createdAt" label="생성일" showTime />,
      ]}
      defaultSort={{ field: 'createdAt', order: 'DESC' }}
      rowClick="show"
      actions={false}
      perPage={50}
    />
  );
};
