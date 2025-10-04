import React from 'react';
import {
  List,
  TopToolbar,
  ExportButton,
  RefreshButton,
  TextInput,
  FilterButton,
  SelectInput,
  useListContext,
} from "react-admin";
import { Box, Chip } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import { EmptyList } from "../common/EmptyList";
import { GroupedTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

const UserListActions = () => (
  <TopToolbar>
    <FilterButton />
    <RefreshButton />
    <ExportButton />
  </TopToolbar>
);

const userFilters = [
  <TextInput
    key="username"
    label="사용자명"
    source="username"
    placeholder="사용자명 검색..."
  />,
  <TextInput
    key="email"
    label="이메일"
    source="email"
    placeholder="이메일 검색..."
  />,
  <TextInput
    key="firstName"
    label="이름"
    source="firstName"
    placeholder="이름 검색..."
  />,
  <TextInput
    key="lastName"
    label="성"
    source="lastName"
    placeholder="성 검색..."
  />,
  <SelectInput
    key="isActive"
    label="활성 상태"
    source="isActive"
    choices={[
      { id: true, name: '활성' },
      { id: false, name: '비활성' },
    ]}
    emptyText="전체"
  />,
  <SelectInput
    key="isVerified"
    label="인증 상태"
    source="isVerified"
    choices={[
      { id: true, name: '인증됨' },
      { id: false, name: '미인증' },
    ]}
    emptyText="전체"
  />,
  <SelectInput
    key="isSuspended"
    label="정지 상태"
    source="isSuspended"
    choices={[
      { id: true, name: '정지됨' },
      { id: false, name: '정상' },
    ]}
    emptyText="전체"
  />
];

// 사용자 데이터를 그룹별로 분리 (활성 상태별로)
const groupUsersByStatus = (userData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  userData.forEach(user => {
    let groupKey: string;
    let groupName: string;
    
    if (user.isSuspended) {
      groupKey = 'suspended';
      groupName = '정지된 사용자';
    } else if (!user.isActive) {
      groupKey = 'inactive';
      groupName = '비활성 사용자';
    } else if (!user.isVerified) {
      groupKey = 'unverified';
      groupName = '미인증 사용자';
    } else {
      groupKey = 'active';
      groupName = '활성 사용자';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(user);
  });
  
  // 그룹 순서: 활성 -> 미인증 -> 비활성 -> 정지
  const order = ['active', 'unverified', 'inactive', 'suspended'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 테이블 컬럼 정의
const userTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
    minWidth: '60px',
    priority: 10, // 높은 우선순위
    hideOnMobile: false,
  },
  {
    key: 'username',
    label: '사용자명',
    width: '120px',
    minWidth: '100px',
    priority: 1, // 가장 높은 우선순위
    hideOnMobile: false,
  },
  {
    key: 'firstName',
    label: '이름',
    width: '100px',
    minWidth: '80px',
    priority: 20,
    hideOnMobile: true, // 모바일에서 숨김
  },
  {
    key: 'lastName',
    label: '성',
    width: '100px',
    minWidth: '80px',
    priority: 25,
    hideOnMobile: true, // 모바일에서 숨김
  },
  {
    key: 'email',
    label: '이메일',
    flex: 1,
    minWidth: '180px',
    maxWidth: '300px',
    priority: 2, // 높은 우선순위
    hideOnMobile: false,
  },
  {
    key: 'isActive',
    label: '활성',
    width: '80px',
    minWidth: '70px',
    align: 'center',
    priority: 30,
    hideOnMobile: true, // 그룹화로 상태를 알 수 있어서 모바일에서 숨김
    render: (value) => (
      <Chip 
        label={value ? '활성' : '비활성'} 
        color={value ? 'success' : 'default'}
        size="small"
      />
    )
  },
  {
    key: 'isVerified',
    label: '인증',
    width: '80px',
    minWidth: '70px',
    align: 'center',
    priority: 15,
    hideOnMobile: false,
    render: (value) => (
      <Chip 
        label={value ? '인증' : '미인증'} 
        color={value ? 'primary' : 'warning'}
        size="small"
      />
    )
  },
  {
    key: 'isSuspended',
    label: '정지',
    width: '80px',
    minWidth: '70px',
    align: 'center',
    priority: 35,
    hideOnMobile: true,
    render: (value) => (
      <Chip 
        label={value ? '정지' : '정상'} 
        color={value ? 'error' : 'success'}
        size="small"
      />
    )
  },
  {
    key: 'lastLoginAt',
    label: '마지막 로그인',
    width: '150px',
    minWidth: '120px',
    priority: 40,
    hideOnMobile: true,
    render: (value) => value ? new Date(value).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '-'
  },
  {
    key: 'createdAt',
    label: '생성일',
    width: '150px',
    minWidth: '120px',
    priority: 45,
    hideOnMobile: true,
    render: (value) => value ? new Date(value).toLocaleString('ko-KR', {
      year: '2-digit',
      month: 'short',
      day: 'numeric'
    }) : '-'
  },
];

// 전체 그룹 표시 컴포넌트
const AllGroupsDatagrid = () => {
  const listContext = useListContext();
  const { data: originalData, isPending } = listContext;
  
  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (!originalData || originalData.length === 0) {
    return (
      <EmptyList
        title="등록된 사용자가 없습니다"
        description="첫 번째 사용자를 추가해보세요"
        icon={<PersonIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="사용자 추가"
      />
    );
  }

  const groupedData = groupUsersByStatus(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={userTableColumns}
          resourceName="privates/users"
          itemLabel="사용자"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={<PersonIcon />}
        />
      ))}
    </Box>
  );
};

export const UserList = () => (
  <List 
    actions={<UserListActions />} 
    filters={userFilters}
    title="사용자 관리 (상태별 보기)"
  >
    <AllGroupsDatagrid />
  </List>
);

export default UserList;