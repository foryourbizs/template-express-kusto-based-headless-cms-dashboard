import React from 'react';
import {
  List,
  TopToolbar,
  CreateButton,
  ExportButton,
  RefreshButton,
  useListContext,
  Pagination,
} from 'react-admin';
import { Chip, Box, Link, Avatar } from '@mui/material';
import {
  InsertDriveFile,
  Image,
  VideoFile,
  AudioFile,
  PictureAsPdf,
  Description,
  Archive,
} from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import GroupedTable, { TableColumn, GroupedTableData } from '../common/GroupedTable';

// 파일 유형별 아이콘 매핑
const getFileIcon = (mimeType: string) => {
  if (mimeType?.startsWith('image/')) {
    return <Image color="primary" />;
  } else if (mimeType?.startsWith('video/')) {
    return <VideoFile color="secondary" />;
  } else if (mimeType?.startsWith('audio/')) {
    return <AudioFile color="info" />;
  } else if (mimeType === 'application/pdf') {
    return <PictureAsPdf color="error" />;
  } else if (mimeType?.includes('zip') || mimeType?.includes('rar') || mimeType?.includes('tar')) {
    return <Archive color="warning" />;
  } else if (mimeType?.includes('text') || mimeType?.includes('document')) {
    return <Description color="success" />;
  }
  return <InsertDriveFile />;
};

// 파일 유형별 그룹화
const groupFilesByType = (fileData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  fileData.forEach(file => {
    let groupKey: string;
    let groupName: string;
    
    const mimeType = file.mimeType || file.contentType || '';
    
    if (mimeType.startsWith('image/')) {
      groupKey = 'images';
      groupName = '이미지 파일';
    } else if (mimeType.startsWith('video/')) {
      groupKey = 'videos';
      groupName = '비디오 파일';
    } else if (mimeType.startsWith('audio/')) {
      groupKey = 'audios';
      groupName = '오디오 파일';
    } else if (mimeType === 'application/pdf') {
      groupKey = 'pdfs';
      groupName = 'PDF 문서';
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
      groupKey = 'archives';
      groupName = '압축 파일';
    } else if (mimeType.includes('text') || mimeType.includes('document')) {
      groupKey = 'documents';
      groupName = '문서 파일';
    } else {
      groupKey = 'others';
      groupName = '기타 파일';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(file);
  });
  
  // 그룹 순서 정의
  const order = ['images', 'videos', 'audios', 'pdfs', 'documents', 'archives', 'others'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 파일 크기 포맷팅 함수
const formatFileSize = (bytes: number) => {
  if (!bytes) return '-';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// 테이블 컬럼 정의
const fileTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
    minWidth: '60px',
    priority: 10,
    hideOnMobile: true,
  },
  {
    key: 'originalName',
    label: '파일명',
    flex: 1,
    minWidth: '200px',
    priority: 1, // 가장 높은 우선순위
    hideOnMobile: false,
    render: (value, record) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 24, height: 24 }}>
          {getFileIcon(record.mimeType)}
        </Avatar>
        {record.url ? (
          <Link 
            href={record.url} 
            target="_blank" 
            rel="noopener noreferrer"
            sx={{ 
              textDecoration: 'none',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {value || record.filename || '파일명 없음'}
          </Link>
        ) : (
          <Box sx={{ 
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}>
            {value || record.filename || '파일명 없음'}
          </Box>
        )}
      </Box>
    )
  },
  {
    key: 'mimeType',
    label: '유형',
    width: '120px',
    minWidth: '100px',
    priority: 30,
    hideOnMobile: true,
    render: (value) => (
      <Chip 
        label={value?.split('/')[1] || '알 수 없음'} 
        size="small"
        variant="outlined"
      />
    )
  },
  {
    key: 'size',
    label: '크기',
    width: '100px',
    minWidth: '80px',
    align: 'right',
    priority: 2, // 높은 우선순위
    hideOnMobile: false,
    render: (value) => formatFileSize(value)
  },
  {
    key: 'isPublic',
    label: '공개',
    width: '80px',
    minWidth: '70px',
    align: 'center',
    priority: 20,
    hideOnMobile: false,
    render: (value) => (
      <Chip 
        label={value ? '공개' : '비공개'} 
        color={value ? 'success' : 'default'}
        size="small"
      />
    )
  },
  {
    key: 'uploadedBy',
    label: '업로더',
    width: '120px',
    minWidth: '100px',
    priority: 35,
    hideOnMobile: true,
    render: (value, record) => record.uploadedBy?.username || record.uploadedBy || '-'
  },
  {
    key: 'createdAt',
    label: '업로드일',
    width: '130px',
    minWidth: '110px',
    priority: 40,
    hideOnMobile: true,
    render: (value) => value ? new Date(value).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '-'
  },
];

// 상단 툴바
const FileListActions = () => (
  <TopToolbar>
    <RefreshButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

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
        title="등록된 파일이 없습니다"
        description="첫 번째 파일을 업로드해보세요"
        icon={<InsertDriveFile sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="파일 업로드"
      />
    );
  }

  const groupedData = groupFilesByType(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={fileTableColumns}

          itemLabel="파일"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={getFileIcon(groupData.items[0]?.mimeType || '')}
        />
      ))}
    </Box>
  );
};

// 파일 리스트 컴포넌트
export const FilesList = () => (
  <List 
    actions={<FileListActions />}
    title="파일 관리 (유형별 보기)"
    pagination={false}
  >
    <Box>
      <AllGroupsDatagrid />
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center',
        mt: 2,
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 1
      }}>
        <Pagination />
      </Box>
    </Box>
  </List>
);

export default FilesList;