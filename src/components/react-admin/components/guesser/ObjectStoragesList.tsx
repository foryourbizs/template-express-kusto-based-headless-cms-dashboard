import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  EditButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  RefreshButton,
  BulkDeleteButton,
  BulkExportButton,
  FunctionField,
  useListContext,
} from 'react-admin';
import {
  Menu as MenuIcon,
} from '@mui/icons-material';
import { Chip } from '@mui/material';
import EmptyList from '../common/EmptyList';

const ListActions = () => (
  <TopToolbar>
    <RefreshButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const BulkActionButtons = () => (
  <>
    <BulkExportButton />
    <BulkDeleteButton />
  </>
);

// Provider 칩 컴포넌트
const ProviderField = ({ record }: any) => {
  const getProviderColor = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 's3': return '#FF9900';
      case 'r2': return '#F48120';
      case 'gcs': return '#4285F4';
      case 'azure': return '#0078D4';
      default: return '#666666';
    }
  };

  return (
    <Chip
      label={record.provider?.toUpperCase() || 'Unknown'}
      style={{
        backgroundColor: getProviderColor(record.provider),
        color: 'white',
        fontWeight: 'bold'
      }}
    />
  );
};

// 상태 표시 컴포넌트
const StatusField = ({ record }: any) => {
  if (record.deletedAt) {
    return <Chip label="삭제됨" color="error" />;
  }
  if (!record.isActive) {
    return <Chip label="비활성" color="warning" />;
  }
  if (record.isDefault) {
    return <Chip label="기본" color="primary" />;
  }
  return <Chip label="활성" color="success" />;
};

// 기본 저장소 표시
const DefaultField = ({ record }: any) => {
  if (record.isDefault) {
    return <Chip label="기본" color="primary" size="small" />;
  }
  return null;
};

const ObjectStoragesList = () => (
  <List
    actions={<ListActions />}
    title="오브젝트 스토리지 관리"
    empty={
      <EmptyList
        title="등록된 오브젝트 스토리지가 없습니다"
        description="첫 번째 오브젝트 스토리지를 추가해보세요"
        icon={<MenuIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="스토리지 추가"
      />
    }
  >
    <Datagrid
      bulkActionButtons={<BulkActionButtons />}
      rowClick="edit"
    >
      <TextField source="id" label="ID" />
      <TextField source="name" label="스토리지명" />
      <FunctionField
        source="provider"
        label="제공업체"
        render={(record: any) => <ProviderField record={record} />}
      />
      <TextField source="bucketName" label="버킷명" />
      <TextField source="region" label="리전" />
      <FunctionField
        source="isDefault"
        label="기본"
        render={(record: any) => <DefaultField record={record} />}
      />
      <FunctionField
        source="status"
        label="상태"
        render={(record: any) => <StatusField record={record} />}
      />
      <TextField source="description" label="설명" />
      <DateField source="createdAt" label="생성일" showTime />
      <DateField source="updatedAt" label="수정일" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export default ObjectStoragesList;
