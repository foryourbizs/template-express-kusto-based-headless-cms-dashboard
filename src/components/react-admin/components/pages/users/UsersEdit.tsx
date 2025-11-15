"use client";

import { Edit, SimpleForm, TextInput, DateInput } from 'react-admin';

export const UsersEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="username" label="사용자명" />
        <TextInput source="email" label="이메일" />
        <DateInput source="createdAt" label="생성일" disabled />
      </SimpleForm>
    </Edit>
  );
};
