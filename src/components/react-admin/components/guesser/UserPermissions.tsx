import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  TopToolbar,
  ExportButton,
  RefreshButton,
  FilterButton,
  TextInput,
  BooleanInput,
  SelectInput,
  useDataProvider,
  useNotify,
  Loading,
} from 'react-admin';
import { useEffect, useState } from 'react';

// 권한 체크 훅
const usePermissionCheck = (resource: string) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await dataProvider.getList(resource, {
          pagination: { page: 1, perPage: 1 },
          sort: { field: 'id', order: 'ASC' },
          filter: {},
        });

        // 데이터가 있으면 권한 있음, 없으면 권한 없음
        setHasPermission(response.data && response.data.length > 0);
      } catch (error: any) {
        console.warn(`Permission check failed for ${resource}:`, error);
        // 403, 401 에러인 경우 권한 없음으로 처리
        if (error.status === 403 || error.status === 401) {
          setHasPermission(false);
        } else {
          // 네트워크 오류 등 다른 에러는 허용
          setHasPermission(true);
        }
      }
    };

    checkPermission();
  }, [resource, dataProvider]);

  return hasPermission;
};

// 권한 목록 액션 버튼들
const UserPermissionsActions = () => (
  <TopToolbar>
    <FilterButton />
    <RefreshButton />
    <ExportButton />
  </TopToolbar>
);

// 권한 필터
const userPermissionFilters = [
  <TextInput
    key="name"
    label="권한명"
    source="name"
    placeholder="권한명 검색..."
  />,
  <TextInput
    key="resource"
    label="리소스"
    source="resource"
    placeholder="리소스 검색..."
  />,
  <TextInput
    key="action"
    label="액션"
    source="action"
    placeholder="액션 검색..."
  />,
  <BooleanInput
    key="isActive"
    label="활성 상태"
    source="isActive"
  />,
  <SelectInput
    key="type"
    label="권한 타입"
    source="type"
    choices={[
      { id: 'read', name: '읽기' },
      { id: 'write', name: '쓰기' },
      { id: 'delete', name: '삭제' },
      { id: 'admin', name: '관리자' },
    ]}
    emptyText="전체"
  />
];

export const UserPermissions = () => {
  const hasPermission = usePermissionCheck('privates/users/permissions');

  // 권한 체크 중
  if (hasPermission === null) {
    return <Loading />;
  }

  // 권한 없음
  if (hasPermission === false) {
    return null;
  }

  // 권한 있음 - 컴포넌트 렌더링
  return (
    <List 
      actions={<UserPermissionsActions />} 
      filters={userPermissionFilters}
      resource="privates/users/permissions"
    >
      <Datagrid
        rowClick="show"
        bulkActionButtons={false} // 벌크 액션 제거
        sx={{
          width: '100%',
          '& .RaDatagrid-table': {
            minWidth: '800px',
            tableLayout: 'auto',
          },
          '& .RaDatagrid-headerRow th': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '8px 16px',
          },
          '& .RaDatagrid-rowCell': {
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            padding: '8px 16px',
          },
        }}
      >
        <TextField source="id" label="ID" />
        <TextField source="name" label="권한명" />
        <TextField source="resource" label="리소스" />
        <TextField source="action" label="액션" />
        <TextField source="description" label="설명" />
        <BooleanField source="isActive" label="활성" />
        <TextField source="type" label="타입" />
        <DateField source="createdAt" label="생성일" showTime />
        <DateField source="updatedAt" label="수정일" showTime />
      </Datagrid>
    </List>
  );
};

export default UserPermissions;
