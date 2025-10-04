'use client';

import React from 'react';
import { 
  List, 
  useListContext,
  TopToolbar,
  RefreshButton,
  ExportButton,
} from 'react-admin';
import { Box, Chip, Typography } from '@mui/material';
import {
  Computer as ComputerIcon,
  PhoneAndroid as MobileIcon,
  Laptop as LaptopIcon,
  TabletMac as TabletIcon,
} from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import GroupedTable, { MultiGroupTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

// 디바이스 타입별 아이콘
const getDeviceIcon = (deviceInfo: string) => {
  const info = deviceInfo?.toLowerCase() || '';
  if (info.includes('mobile') || info.includes('android') || info.includes('iphone')) {
    return <MobileIcon />;
  } else if (info.includes('tablet') || info.includes('ipad')) {
    return <TabletIcon />;
  } else if (info.includes('laptop') || info.includes('macbook')) {
    return <LaptopIcon />;
  }
  return <ComputerIcon />;
};

// 세션을 상태별로 그룹화
const groupSessionsByStatus = (sessionData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  sessionData.forEach(session => {
    let groupKey: string;
    let groupName: string;
    
    if (session.isCompromised) {
      groupKey = 'compromised';
      groupName = '보안 위험 세션';
    } else if (!session.isActive) {
      groupKey = 'inactive';
      groupName = '비활성 세션';
    } else if (new Date(session.expiresAt) < new Date()) {
      groupKey = 'expired';
      groupName = '만료된 세션';
    } else {
      groupKey = 'active';
      groupName = '활성 세션';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(session);
  });
  
  // 그룹 순서: 활성 -> 만료 -> 비활성 -> 보안위험
  const order = ['active', 'expired', 'inactive', 'compromised'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 테이블 컬럼 정의
const sessionTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
  },
  {
    key: 'userUuid',
    label: '사용자 UUID',
    width: '200px',
  },
  {
    key: 'deviceInfo',
    label: '디바이스',
    flex: 1,
    render: (value, record) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {getDeviceIcon(value)}
        {value || '알 수 없는 디바이스'}
      </Box>
    )
  },
  {
    key: 'ipAddress',
    label: 'IP 주소',
    width: '120px',
  },
  {
    key: 'location',
    label: '위치',
    width: '120px',
  },
  {
    key: 'isActive',
    label: '활성',
    width: '80px',
    align: 'center',
    render: (value) => (
      <Chip 
        label={value ? '활성' : '비활성'} 
        color={value ? 'success' : 'default'}
        size="small"
      />
    )
  },
  {
    key: 'isCompromised',
    label: '보안상태',
    width: '100px',
    align: 'center',
    render: (value) => (
      <Chip 
        label={value ? '위험' : '안전'} 
        color={value ? 'error' : 'success'}
        size="small"
      />
    )
  },
  {
    key: 'trustScore',
    label: '신뢰점수',
    width: '100px',
    align: 'center',
    render: (value) => value || '-'
  },
  {
    key: 'lastUsedAt',
    label: '마지막 사용',
    width: '150px',
    render: (value) => value ? new Date(value).toLocaleString('ko-KR') : '-'
  },
  {
    key: 'expiresAt',
    label: '만료일',
    width: '150px',
    render: (value) => value ? new Date(value).toLocaleString('ko-KR') : '-'
  },
];

// 상단 툴바
const SessionListActions = () => (
  <TopToolbar>
    <RefreshButton />
    <ExportButton />
  </TopToolbar>
);

// 전체 그룹 표시 컴포넌트
const AllGroupsDatagrid = () => {
  const listContext = useListContext();
  const { data: originalData, isPending, total } = listContext;
  
  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (!originalData || originalData.length === 0) {
    return (
      <EmptyList
        title="활성화된 세션이 없습니다"
        description="사용자가 로그인하면 세션 정보가 여기에 표시됩니다"
        icon={<ComputerIcon sx={{ fontSize: 48, color: 'text.security', mb: 2 }} />}
        showCreateButton={false}
      />
    );
  }

  const groupedData = groupSessionsByStatus(originalData);

  return (
    <Box>
      

      {/* 현재 페이지의 그룹별 테이블들 */}
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={sessionTableColumns}
          itemLabel="세션"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={<ComputerIcon />}
          pagination={{
            enabled: false // 서버 페이지네이션을 사용하므로 테이블 자체 페이지네이션은 비활성화
          }}
        />
      ))}
    </Box>
  );
};

export const UserSessionList = () => (
  <List
    actions={<SessionListActions />}
    title="사용자 세션 관리 (상태별 보기)"
    perPage={30} // 적절한 페이지 크기
  >
    <AllGroupsDatagrid />
  </List>
);

export default UserSessionList;