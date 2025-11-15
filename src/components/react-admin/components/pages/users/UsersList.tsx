"use client";

import { 
  List, 
  Datagrid, 
  TextField, 
  EmailField, 
  DateField,
  BooleanField,
  FunctionField,
  ChipField,
  useRecordContext,
} from 'react-admin';
import { Chip } from '@mui/material';

const StatusField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const getStatusColor = () => {
    if (record.isSuspended) return 'error';
    if (!record.isActive) return 'default';
    if (!record.isVerified) return 'warning';
    return 'success';
  };

  const getStatusLabel = () => {
    if (record.isSuspended) return '정지됨';
    if (!record.isActive) return '비활성';
    if (!record.isVerified) return '미인증';
    return '활성';
  };

  return (
    <Chip 
      label={getStatusLabel()} 
      color={getStatusColor()} 
      size="small" 
    />
  );
};

export const UsersList = () => {
  return (
    <List 
      sort={{ field: 'createdAt', order: 'DESC' }}
      perPage={25}
      filters={[
        // 추후 필터 추가 가능
      ]}
    >
      <Datagrid 
        rowClick="show"
        bulkActionButtons={false}
        sx={{
          '& .RaDatagrid-headerCell': {
            fontWeight: 700,
            backgroundColor: 'action.hover',
          },
        }}
      >
        <TextField source="id" label="ID" />
        <TextField source="username" label="사용자명" />
        <EmailField source="email" label="이메일" />
        <FunctionField 
          label="이름" 
          render={(record: any) => 
            record.firstName || record.lastName 
              ? `${record.firstName || ''} ${record.lastName || ''}`.trim()
              : '-'
          } 
        />
        <FunctionField 
          label="상태" 
          render={(record: any) => <StatusField />} 
        />
        <BooleanField source="twoFactorEnabled" label="2FA" />
        <DateField source="lastLoginAt" label="최근 로그인" showTime />
        <DateField source="createdAt" label="생성일" showTime />
      </Datagrid>
    </List>
  );
};
