import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  EditButton,
  ShowButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  RefreshButton,
  BulkDeleteButton,
  BulkExportButton,
  TextInput,
} from 'react-admin';

// 권한 전용 벌크 액션 버튼
const PermissionBulkActionButtons = () => (
  <>
    <BulkExportButton />
    <BulkDeleteButton />
  </>
);

// 권한 전용 액션 버튼들
const PermissionActions = () => (
  <TopToolbar>
    <FilterButton />
    <RefreshButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// 권한 전용 필터
const permissionFilters = [
  <TextInput key="name" label="권한명" source="name" placeholder="권한명 검색..." />,
  <TextInput key="resource" label="리소스" source="resource" placeholder="리소스 검색..." />,
  <TextInput key="action" label="액션" source="action" placeholder="액션 검색..." />,
  <TextInput key="description" label="설명" source="description" placeholder="설명 검색..." />,
];

// 권한 리스트 컴포넌트 - BulkDeleteButton 활성화
export const PermissionsListWithDelete = (props: any) => {
  return (
    <List
      {...props}
      actions={<PermissionActions />}
      filters={permissionFilters}
    >
      <Datagrid
        rowClick="edit"
        bulkActionButtons={<PermissionBulkActionButtons />}
      >
        <TextField source="id" label="ID" />
        <TextField source="name" label="권한명" />
        <TextField source="resource" label="리소스" />
        <TextField source="action" label="액션" />
        <TextField source="description" label="설명" />
        <BooleanField source="isSystem" label="시스템 권한" />
        <DateField source="createdAt" label="생성일" showTime />
        <DateField source="updatedAt" label="수정일" showTime />
        {/* <EditButton /> */}
        {/* <ShowButton /> */}
        <DeleteButton />
      </Datagrid>
    </List>
  );
};
