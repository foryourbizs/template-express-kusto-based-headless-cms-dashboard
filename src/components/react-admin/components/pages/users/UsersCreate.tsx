"use client";

import { Create, SimpleForm, TextInput } from 'react-admin';

export const UsersCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="attributes.username" label="사용자명" required />
        <TextInput source="attributes.email" label="이메일" type="email" required />
        <TextInput source="attributes.password" label="비밀번호" type="password" required />
      </SimpleForm>
    </Create>
  );
};
