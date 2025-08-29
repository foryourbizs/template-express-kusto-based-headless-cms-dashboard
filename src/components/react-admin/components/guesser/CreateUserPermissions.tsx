import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  required,
} from 'react-admin';

// 권한 타입 선택 옵션
const permissionTypeChoices = [
  { id: 'read', name: '읽기' },
  { id: 'write', name: '쓰기' },
  { id: 'delete', name: '삭제' },
  { id: 'admin', name: '관리자' },
];

// 액션 타입 선택 옵션
const actionChoices = [
  { id: 'create', name: '생성' },
  { id: 'read', name: '읽기' },
  { id: 'update', name: '수정' },
  { id: 'delete', name: '삭제' },
  { id: 'list', name: '목록' },
  { id: 'show', name: '상세보기' },
  { id: 'export', name: '내보내기' },
];

export const CreateUserPermissions = () => {
  // Create 페이지에서는 권한 체크를 하지 않음 (List에서 이미 체크됨)
  // 또는 다른 권한 체크 로직 사용 가능
  
  return (
    <Create resource="privates/users/permissions" title="새 권한 생성">
      <SimpleForm>
        <TextInput
          source="name"
          label="권한명"
          validate={[required()]}
          fullWidth
          helperText="권한의 고유한 이름을 입력하세요"
        />
        
        <TextInput
          source="resource"
          label="리소스"
          validate={[required()]}
          fullWidth
          helperText="권한이 적용될 리소스 경로를 입력하세요 (예: users, posts, comments)"
        />
        
        <SelectInput
          source="action"
          label="액션"
          choices={actionChoices}
          validate={[required()]}
          fullWidth
          helperText="이 권한으로 수행할 수 있는 작업을 선택하세요"
        />
        
        <TextInput
          source="description"
          label="설명"
          multiline
          rows={3}
          fullWidth
          helperText="권한에 대한 자세한 설명을 입력하세요"
        />
        
        <SelectInput
          source="type"
          label="권한 타입"
          choices={permissionTypeChoices}
          validate={[required()]}
          fullWidth
          helperText="권한의 레벨을 선택하세요"
        />
        
        <BooleanInput
          source="isActive"
          label="활성 상태"
          defaultValue={true}
          helperText="권한을 즉시 활성화할지 선택하세요"
        />
        
        <TextInput
          source="scope"
          label="범위"
          fullWidth
          helperText="권한이 적용되는 범위를 입력하세요 (선택사항)"
        />
        
        <TextInput
          source="conditions"
          label="조건"
          multiline
          rows={2}
          fullWidth
          helperText="권한 적용 조건을 JSON 형태로 입력하세요 (선택사항)"
        />
      </SimpleForm>
    </Create>
  );
};

export default CreateUserPermissions;
