"use client";

import { Edit, SimpleForm, TextInput, NumberInput } from 'react-admin';

export const FilesEdit = () => {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="attributes.filename" label="파일명" />
        <TextInput source="attributes.description" label="설명" multiline rows={3} />
        <TextInput source="attributes.tags" label="태그" helperText="쉼표로 구분" />
      </SimpleForm>
    </Edit>
  );
};
