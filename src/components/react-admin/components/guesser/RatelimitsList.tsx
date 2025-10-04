import React, { useState, useEffect } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  BooleanField,
  NumberField,
  TopToolbar,
  CreateButton,
  ExportButton,
  RefreshButton,
  FilterButton,
  FunctionField,
  TextInput,
  BooleanInput,
  NumberInput,
  SelectInput,
  EmailField,
  ReferenceField,
  useTranslate,
} from 'react-admin';
import {
  Box,
  Typography,
  Chip,
  Paper,
} from '@mui/material';
import {
  Speed as SpeedIcon,
  Block as BlockIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Timer as TimerIcon,
} from '@mui/icons-material';
import EmptyList from '../common/EmptyList';

// 검색 필터
const ratelimitFilters = [
  <TextInput key="userUuid" label="사용자 UUID" source="userUuid" placeholder="사용자 UUID 검색" />,
  <TextInput key="user.email" label="사용자 이메일" source="user.email" placeholder="사용자 이메일 검색" />,
  <TextInput key="ipAddress" label="IP 주소" source="ipAddress" placeholder="IP 주소 검색" />,
  <TextInput key="endpoint" label="엔드포인트" source="endpoint" placeholder="API 엔드포인트 검색" />,
  <SelectInput
    key="method"
    label="HTTP 메소드"
    source="method"
    choices={[
      { id: 'GET', name: 'GET' },
      { id: 'POST', name: 'POST' },
      { id: 'PUT', name: 'PUT' },
      { id: 'DELETE', name: 'DELETE' },
      { id: 'PATCH', name: 'PATCH' },
    ]}
    emptyText="전체"
  />,
  <BooleanInput key="isBlocked" label="차단 여부" source="isBlocked" />,
];

// 상단 액션 버튼
const RatelimitListActions = () => {
  const translate = useTranslate();
  
  return (
    <TopToolbar>
      <FilterButton />
      <RefreshButton />
      <ExportButton />
    </TopToolbar>
  );
};

// 사용자 정보 표시 컴포넌트 (관계 데이터 포함)
const UserField = ({ record }: { record: any }) => {
  const userUuid = record.userUuid;
  const user = record.user; // include된 관계 데이터
  
  if (!userUuid) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <SpeedIcon color="secondary" fontSize="small" />
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {record.ipAddress}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            IP 주소
          </Typography>
        </Box>
      </Box>
    );
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <SpeedIcon color="primary" fontSize="small" />
      <Box>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {user?.email || `${userUuid.slice(0, 8)}...`}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.username || '사용자'}
        </Typography>
      </Box>
    </Box>
  );
};

// 상태 표시 컴포넌트 (실시간 업데이트)
const StatusField = ({ record }: { record: any }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const isBlocked = record.isBlocked;
  const blockUntil = record.blockUntil;
  const windowEnd = record.windowEnd;
  
  // 차단 상태가 변경될 수 있는 경우에만 실시간 업데이트
  const shouldUpdate = isBlocked && blockUntil && new Date(blockUntil).getTime() > currentTime.getTime() - 5000; // 5초 여유
  
  useEffect(() => {
    if (!shouldUpdate) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [shouldUpdate]);
  
  // 실시간으로 차단 상태 확인
  const isCurrentlyBlocked = isBlocked && blockUntil && new Date(blockUntil) > currentTime;
  
  // 차단 상태 확인
  if (isCurrentlyBlocked) {
    return (
      <Chip
        icon={<BlockIcon />}
        label="차단됨"
        color="error"
        variant="filled"
        size="small"
      />
    );
  }
  
  // 윈도우 만료 확인
  if (windowEnd && new Date(windowEnd) < currentTime) {
    return (
      <Chip
        icon={<TimerIcon />}
        label="만료됨"
        color="default"
        variant="outlined"
        size="small"
      />
    );
  }
  
  // 활성 상태
  return (
    <Chip
      icon={<CheckCircleIcon />}
      label="활성"
      color="success"
      variant="filled"
      size="small"
    />
  );
};

// 요청 수 표시 컴포넌트
const RequestCountField = ({ record }: { record: any }) => {
  const requestCount = record.requestCount || 0;
  
  // 일반적인 rate limit 기준으로 색상 결정
  let color = 'success';
  if (requestCount >= 100) color = 'error';
  else if (requestCount >= 50) color = 'warning';

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {requestCount}회
      </Typography>
      <Typography variant="caption" color={`${color}.main`}>
        {requestCount >= 100 ? '위험' : requestCount >= 50 ? '주의' : '정상'}
      </Typography>
    </Box>
  );
};

// 시간 윈도우 표시 컴포넌트
const WindowField = ({ record }: { record: any }) => {
  const windowStart = record.windowStart;
  const windowEnd = record.windowEnd;
  
  if (!windowStart || !windowEnd) {
    return <Typography variant="body2" color="text.secondary">-</Typography>;
  }

  const start = new Date(windowStart);
  const end = new Date(windowEnd);
  const durationMs = end.getTime() - start.getTime();
  const durationMinutes = Math.floor(durationMs / 60000);
  
  let displayText = '';
  if (durationMinutes >= 60) {
    const hours = Math.floor(durationMinutes / 60);
    displayText = `${hours}시간`;
  } else {
    displayText = `${durationMinutes}분`;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <TimerIcon fontSize="small" color="action" />
      <Typography variant="body2">
        {displayText}
      </Typography>
    </Box>
  );
};

// HTTP 메소드 표시 컴포넌트
const MethodField = ({ record }: { record: any }) => {
  const method = record.method || 'GET';
  
  let color: 'success' | 'info' | 'warning' | 'error' = 'info';
  switch (method) {
    case 'GET':
      color = 'info';
      break;
    case 'POST':
      color = 'success';
      break;
    case 'PUT':
    case 'PATCH':
      color = 'warning';
      break;
    case 'DELETE':
      color = 'error';
      break;
  }

  return (
    <Chip
      label={method}
      color={color}
      variant="outlined"
      size="small"
      sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}
    />
  );
};

// 차단 해제 시간 표시 컴포넌트 (실시간 업데이트)
const BlockUntilField = ({ record }: { record: any }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const blockUntil = record.blockUntil;
  
  // 차단된 상태이고 blockUntil이 있는 경우에만 실시간 업데이트
  const shouldUpdate = record.isBlocked && blockUntil && new Date(blockUntil) > currentTime;
  
  useEffect(() => {
    if (!shouldUpdate) return;
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, [shouldUpdate]);
  
  if (!blockUntil || !record.isBlocked) {
    return <Typography variant="body2" color="text.secondary">-</Typography>;
  }

  const blockTime = new Date(blockUntil);
  const diffMs = blockTime.getTime() - currentTime.getTime();
  
  if (diffMs <= 0) {
    return <Typography variant="body2" color="success.main">차단 해제됨</Typography>;
  }
  
  const diffSeconds = Math.floor(diffMs / 1000);
  
  let displayText = '';
  if (diffSeconds >= 3600) {
    const hours = Math.floor(diffSeconds / 3600);
    const mins = Math.floor((diffSeconds % 3600) / 60);
    const secs = diffSeconds % 60;
    displayText = `${hours}시간 ${mins}분 ${secs}초`;
  } else if (diffSeconds >= 60) {
    const mins = Math.floor(diffSeconds / 60);
    const secs = diffSeconds % 60;
    displayText = `${mins}분 ${secs}초`;
  } else {
    displayText = `${diffSeconds}초`;
  }

  return (
    <Typography 
      variant="body2" 
      color="error.main"
      sx={{ 
        fontFamily: 'monospace', // 숫자가 바뀔 때 레이아웃 흔들림 방지
        minWidth: '80px' // 최소 너비 설정으로 레이아웃 안정성 확보
      }}
    >
      {displayText} 후 해제
    </Typography>
  );
};

export const RatelimitsList = () => (
  <List
    actions={<RatelimitListActions />}
    filters={ratelimitFilters}
    title="처리율 제한 장치"
    perPage={25}
    // 관계 데이터 포함 (user 정보)
    queryOptions={{
      meta: {
        include: 'user'
      }
    }}
    empty={
      <EmptyList
        title="활성화된 처리율 제한이 없습니다"
        description="사용자의 API 요청이나 액션에 대한 처리율 제한 정보가 여기에 표시됩니다"
        icon={<SpeedIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        showCreateButton={false}
      />
    }
  >
    <Datagrid 
      rowClick="edit" 
      bulkActionButtons={false}
      sx={{
        '& .RaDatagrid-table': {
          minWidth: '1000px',
        },
        '& .RaDatagrid-headerRow th': {
          whiteSpace: 'nowrap',
          padding: '8px 16px',
        },
        '& .RaDatagrid-rowCell': {
          padding: '8px 16px',
        },
      }}
    >
      {/* ID */}
      <NumberField source="id" label="ID" />

      {/* 사용자 정보 (관계 데이터 포함) */}
      <FunctionField
        label="사용자"
        render={(record) => <UserField record={record} />}
        sortBy="userUuid"
      />

      {/* 대안: ReferenceField 사용 (userUuid가 있는 경우만) */}
      {/* 
      <ReferenceField
        label="사용자 이메일"
        source="userUuid"
        reference="privates/users"
        link={false}
      >
        <EmailField source="email" />
      </ReferenceField>
      */}

      {/* API 엔드포인트 */}
      <TextField source="endpoint" label="엔드포인트" />

      {/* HTTP 메소드 */}
      <FunctionField
        label="메소드"
        render={(record) => <MethodField record={record} />}
        sortBy="method"
      />

      {/* 상태 */}
      <FunctionField
        label="상태"
        render={(record) => <StatusField record={record} />}
        sortBy="isBlocked"
      />

      {/* 요청 횟수 */}
      <FunctionField
        label="요청 횟수"
        render={(record) => <RequestCountField record={record} />}
        sortBy="requestCount"
      />

      {/* 시간 윈도우 */}
      <FunctionField
        label="윈도우"
        render={(record) => <WindowField record={record} />}
        sortBy="windowStart"
      />

      {/* 차단 해제 시간 */}
      <FunctionField
        label="차단 해제"
        render={(record) => <BlockUntilField record={record} />}
        sortBy="blockUntil"
      />

      {/* 마지막 요청 시간 */}
      <DateField source="lastRequest" label="마지막 요청" showTime />

      {/* 생성일 */}
      <DateField source="createdAt" label="생성일" showTime />

      {/* 수정일 */}
      <DateField source="updatedAt" label="업데이트" showTime />

    </Datagrid>
  </List>
);

export default RatelimitsList;