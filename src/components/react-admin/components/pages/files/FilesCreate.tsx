"use client";

import { Create, SimpleForm, TextInput, FileInput, FileField } from 'react-admin';

export const FilesCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <FileInput source="file" label="파일 선택">
          <FileField source="src" title="title" />
        </FileInput>
        <TextInput source="attributes.description" label="설명" multiline rows={3} />
        <TextInput source="attributes.tags" label="태그" helperText="쉼표로 구분" />
      </SimpleForm>
    </Create>
  );
};
