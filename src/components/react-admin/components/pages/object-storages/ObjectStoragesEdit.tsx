"use client";

import { Edit, SimpleForm, TextInput, BooleanInput, SelectInput } from 'react-admin';

export const ObjectStoragesEdit = () => {
  return (
    <Edit>
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
        />
        <TextInput source="attributes.region" label="리전" />
        <TextInput source="attributes.bucket" label="버킷명" />
        <BooleanInput source="attributes.isDefault" label="기본 저장소로 설정" />
      </SimpleForm>
    </Edit>
  );
};
