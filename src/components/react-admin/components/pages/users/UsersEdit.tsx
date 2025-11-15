"use client";

import { Edit, SimpleForm, TextInput, DateInput } from 'react-admin';

export const UsersEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="attributes.username" label="사용자명" />
        <TextInput source="attributes.email" label="이메일" />
        <DateInput source="attributes.createdAt" label="생성일" disabled />
      </SimpleForm>
    </Edit>
  );
};
