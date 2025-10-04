import React from 'react';
import {
  List,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  TextInput,
  useListContext,
} from 'react-admin';
import { Box, Chip } from '@mui/material';
import { Article as ArticleIcon } from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import { GroupedTable, TableColumn, GroupedTableData } from '../common/GroupedTable';

// 포스트를 상태별로 그룹화
const groupPostsByStatus = (postData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  postData.forEach(post => {
    let groupKey: string;
    let groupName: string;
    
    if (post.status === 'published') {
      groupKey = 'published';
      groupName = '게시된 포스트';
    } else if (post.status === 'draft') {
      groupKey = 'draft';
      groupName = '초안';
    } else if (post.status === 'archived') {
      groupKey = 'archived';
      groupName = '보관된 포스트';
    } else {
      groupKey = 'other';
      groupName = '기타';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(post);
  });
  
  const order = ['published', 'draft', 'archived', 'other'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 테이블 컬럼 정의
const postTableColumns: TableColumn[] = [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
  },
  {
    key: 'title',
    label: '제목',
    flex: 1,
  },
  {
    key: 'status',
    label: '상태',
    width: '100px',
    align: 'center',
    render: (value) => (
      <Chip 
        label={value || 'draft'} 
        color={value === 'published' ? 'success' : 'default'}
        size="small"
      />
    )
  },
  {
    key: 'createdAt',
    label: '생성일',
    width: '150px',
    render: (value) => value ? new Date(value).toLocaleString('ko-KR') : '-'
  },
];

const AllGroupsDatagrid = () => {
  const listContext = useListContext();
  const { data: originalData, isPending } = listContext;
  
  if (isPending) return <div>로딩 중...</div>;

  if (!originalData || originalData.length === 0) {
    return (
      <EmptyList
        title="등록된 포스트가 없습니다"
        description="첫 번째 포스트를 추가해보세요"
        icon={<ArticleIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="포스트 추가"
      />
    );
  }

  const groupedData = groupPostsByStatus(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={postTableColumns}
          resourceName="privates/posts"
          itemLabel="포스트"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={<ArticleIcon />}
        />
      ))}
    </Box>
  );
};

export const PostList = () => (
  <List
    actions={
      <TopToolbar>
        <FilterButton />
        <CreateButton />
        <ExportButton />
      </TopToolbar>
    }
    filters={[
      <TextInput key="title" label="제목" source="title" placeholder="제목 검색..." />,
    ]}
    title="포스트 관리 (상태별 보기)"
  >
    <AllGroupsDatagrid />
  </List>
);

export default PostList;