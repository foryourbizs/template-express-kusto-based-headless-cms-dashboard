import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  required,
  maxLength,
  useNotify,
  useRedirect,
} from 'react-admin';

// 리소스 선택 옵션 - 일반적인 리소스들
const resourceChoices = [
  { id: 'users', name: '사용자 (users)' },
  { id: 'posts', name: '게시글 (posts)' },
  { id: 'comments', name: '댓글 (comments)' },
  { id: 'profile', name: '프로필 (profile)' },
  { id: 'admin', name: '관리자 (admin)' },
  { id: 'dashboard', name: '대시보드 (dashboard)' },
  { id: 'reports', name: '리포트 (reports)' },
  { id: 'settings', name: '설정 (settings)' },
  { id: 'permissions', name: '권한 (permissions)' },
  { id: 'roles', name: '역할 (roles)' },
];

// 액션 타입 선택 옵션 - CRUD 기본 액션들
const actionChoices = [
  { id: 'create', name: '생성 (create)' },
  { id: 'read', name: '읽기 (read)' },
  { id: 'update', name: '수정 (update)' },
  { id: 'delete', name: '삭제 (delete)' },
  { id: 'list', name: '목록 (list)' },
  { id: 'show', name: '상세보기 (show)' },
  { id: 'export', name: '내보내기 (export)' },
  { id: 'import', name: '가져오기 (import)' },
  { id: 'manage', name: '관리 (manage)' },
  { id: 'approve', name: '승인 (approve)' },
];

// 권한명 생성 함수 - resource.action 형태로 자동 생성
const generatePermissionName = (resource: string, action: string): string => {
  if (!resource || !action) return '';
  return `${resource}.${action}`;
};

export const CreateUserPermissions = () => {
  const notify = useNotify();
  const redirect = useRedirect();

  // 폼 제출 시 권한명 자동 생성
  const transform = (data: any) => {
    // resource와 action이 있으면 자동으로 name 생성
    if (data.resource && data.action && !data.name) {
      data.name = generatePermissionName(data.resource, data.action);
    }
    
    // UUID는 서버에서 자동 생성되므로 제거
    delete data.uuid;
    
    return data;
  };

  return (
    <Create 
    //   resource="privates/users/permissions" 
      title="새 권한 생성"
      transform={transform}
    >
      <SimpleForm>
        {/* 권한명 - resource.action 형태로 자동 생성 또는 수동 입력 */}
        <TextInput
          source="name"
          label="권한명"
          validate={[required(), maxLength(100)]}
          fullWidth
          helperText="권한의 고유한 이름 (예: posts.create, profile.update) - 리소스와 액션을 선택하면 자동 생성됩니다"
        />
        
        {/* 리소스 */}
        <SelectInput
          source="resource"
          label="리소스"
          choices={resourceChoices}
          validate={[required(), maxLength(50)]}
          fullWidth
          helperText="권한이 적용될 리소스를 선택하세요"
          onCreate={() => ({ id: 'new', name: '직접 입력...' })}
        />
        
        {/* 리소스 직접 입력 (SelectInput에서 "직접 입력" 선택 시) */}
        <TextInput
          source="resource"
          label="리소스 (직접 입력)"
          validate={[maxLength(50)]}
          fullWidth
          helperText="위 목록에 없는 리소스를 직접 입력하세요"
          sx={{ display: 'none' }} // JavaScript로 동적 표시 제어 가능
        />
        
        {/* 액션 */}
        <SelectInput
          source="action"
          label="액션"
          choices={actionChoices}
          validate={[required(), maxLength(50)]}
          fullWidth
          helperText="이 권한으로 수행할 수 있는 작업을 선택하세요"
          onCreate={() => ({ id: 'new', name: '직접 입력...' })}
        />
        
        {/* 액션 직접 입력 */}
        <TextInput
          source="action"
          label="액션 (직접 입력)"
          validate={[maxLength(50)]}
          fullWidth
          helperText="위 목록에 없는 액션을 직접 입력하세요"
          sx={{ display: 'none' }} // JavaScript로 동적 표시 제어 가능
        />
        
        {/* 설명 */}
        <TextInput
          source="description"
          label="설명"
          validate={[maxLength(500)]}
          multiline
          rows={3}
          fullWidth
          helperText="권한의 목적과 범위에 대한 자세한 설명을 입력하세요 (최대 500자)"
        />
        
        {/* 시스템 권한 여부 */}
        <BooleanInput
          source="isSystem"
          label="시스템 권한"
          defaultValue={false}
          helperText="시스템 기본 권한으로 설정하면 삭제/수정이 불가합니다"
        />
      </SimpleForm>
    </Create>
  );
};

export default CreateUserPermissions;
