"use client";

/**
 * UsersList - GenericList를 사용한 사용자 목록 예제
 * 
 * 기존 UsersList.tsx를 GenericList 컴포넌트를 활용하여 재구성한 예제입니다.
 * 코드량이 대폭 줄어들고 유지보수성이 향상되었습니다.
 */

import { 
  TextField, 
  EmailField, 
  DateField,
  BooleanField,
  FunctionField,
  TextInput,
  SelectInput,
  NullableBooleanInput,
  DateInput,
  useRecordContext,
} from 'react-admin';
import { Chip } from '@mui/material';
import { GenericList } from '../../guesser';

/**
 * 사용자 상태 표시 컴포넌트
 */
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

/**
 * 사용자 목록 필터 정의
 */
const userFilters = [
  <SelectInput
    key="status"
    source="status"
    label="계정 상태"
    choices={[
      { id: 'active', name: '활성' },
      { id: 'inactive', name: '비활성' },
      { id: 'unverified', name: '미인증' },
      { id: 'suspended', name: '정지됨' },
    ]}
    alwaysOn={true}
    sx={{ minWidth: 150 }}
  />,
  <TextInput 
    key="search" 
    source="q" 
    label="검색"  
    placeholder="사용자명 또는 이메일"
    sx={{ minWidth: 200 }}
  />,
  <TextInput 
    key="username" 
    source="username" 
    label="사용자명"
    sx={{ minWidth: 150 }}
  />,
  <TextInput 
    key="email" 
    source="email" 
    label="이메일"
    sx={{ minWidth: 200 }}
  />,
  <NullableBooleanInput
    key="isActive"
    source="isActive"
    label="활성화"
    sx={{ minWidth: 120 }}
  />,
  <NullableBooleanInput
    key="isVerified"
    source="isVerified"
    label="이메일 인증"
    sx={{ minWidth: 120 }}
  />,
  <NullableBooleanInput
    key="isSuspended"
    source="isSuspended"
    label="정지 상태"
    sx={{ minWidth: 120 }}
  />,
  <NullableBooleanInput
    key="twoFactorEnabled"
    source="twoFactorEnabled"
    label="2FA 활성화"
    sx={{ minWidth: 120 }}
  />,
  <DateInput
    key="createdAtStart"
    source="createdAt_gte"
    label="생성일 (시작)"
    sx={{ minWidth: 150 }}
  />,
  <DateInput
    key="createdAtEnd"
    source="createdAt_lte"
    label="생성일 (종료)"
    sx={{ minWidth: 150 }}
  />,
  <DateInput
    key="lastLoginStart"
    source="lastLoginAt_gte"
    label="최근 로그인 (시작)"
    sx={{ minWidth: 150 }}
  />,
  <DateInput
    key="lastLoginEnd"
    source="lastLoginAt_lte"
    label="최근 로그인 (종료)"
    sx={{ minWidth: 150 }}
  />,
];

/**
 * 사용자 목록 컬럼 정의
 */
const userColumns = [
  <TextField source="id" label="ID" key="id" />,
  <TextField source="username" label="사용자명" key="username" />,
  <EmailField source="email" label="이메일" key="email" />,
  <FunctionField 
    label="이름" 
    render={(record: any) => 
      record.firstName || record.lastName 
        ? `${record.firstName || ''} ${record.lastName || ''}`.trim()
        : '-'
    }
    key="name"
  />,
  <FunctionField 
    label="상태" 
    render={() => <StatusField />}
    key="status"
  />,
  <BooleanField source="twoFactorEnabled" label="2FA" key="2fa" />,
  <DateField source="lastLoginAt" label="최근 로그인" showTime key="lastLogin" />,
  <DateField source="createdAt" label="생성일" showTime key="created" />,
];

/**
 * 사용자 목록 컴포넌트
 * 
 * GenericList를 사용하여 간결하게 구현
 * 기존 대비 약 70% 코드량 감소
 */
export const UsersList = () => {
  return (
    <GenericList
      columns={userColumns}
      filters={userFilters}
      filterDefaultValues={{ status: 'active' }}
      defaultSort={{ field: 'createdAt', order: 'DESC' }}
      perPage={25}
      rowClick="show"
      enableBulkActions={false}
    />
  );
};

export default UsersList;
