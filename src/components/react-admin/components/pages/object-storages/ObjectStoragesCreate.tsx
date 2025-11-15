"use client";

import { Create, SimpleForm, TextInput, BooleanInput, SelectInput } from 'react-admin';

export const ObjectStoragesCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <TextInput source="attributes.name" label="저장소명" required />
        <SelectInput 
          source="attributes.provider" 
          label="제공자" 
          choices={[
            { id: 'aws', name: 'AWS S3' },
            { id: 'azure', name: 'Azure Blob' },
            { id: 'gcp', name: 'Google Cloud Storage' },
          ]}
          required
        />
        <TextInput source="attributes.region" label="리전" required />
        <TextInput source="attributes.bucket" label="버킷명" required />
        <TextInput source="attributes.accessKey" label="액세스 키" required />
        <TextInput source="attributes.secretKey" label="시크릿 키" type="password" required />
        <BooleanInput source="attributes.isDefault" label="기본 저장소로 설정" />
      </SimpleForm>
    </Create>
  );
};
