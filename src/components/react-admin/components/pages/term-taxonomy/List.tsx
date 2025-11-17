"use client";

import { TextField, DateField, NumberField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const TermTaxonomyList = () => {
  return (
    <GenericList
      queryOptions={{
        meta: {
          include: ['term', 'parent', 'children']
        }
      }}
      columns={[
        <TextField key="id" source="id" label="ID" />,

        <TextField key="taxonomy" source="taxonomy" label="분류 유형" />,
        <TextField key="description" source="description" label="설명" />,

        <DateField key="createdAt" source="createdAt" label="생성일" showTime />,
      ]}
      defaultSort={{ field: 'createdAt', order: 'DESC' }}
      rowClick="show"
      actions={false}
      perPage={50}
    />
  );
};
