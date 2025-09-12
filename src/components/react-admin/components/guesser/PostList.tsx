import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  UrlField,
  DateField,
  ReferenceField,
  BooleanField,
  NumberField,
  ChipField,
  EditButton,
  ShowButton,
  DeleteButton,
  BulkDeleteButton,
  FilterButton,
  CreateButton,
  ExportButton,
  TopToolbar,
  SelectColumnsButton,
  DatagridConfigurable,
  SearchInput,
  TextInput,
  ReferenceInput,
  SelectInput,
  DateInput,
  BooleanInput,
  NullableBooleanInput,
} from 'react-admin';
import {
  Card,
  CardContent,
  Box,
  Chip,
  Typography,
  Avatar,
} from '@mui/material';
import {
  Article,
  Visibility,
  Schedule,
  Person,
  Category,
  Comment,
} from '@mui/icons-material';

// 게시물 상태 색상 매핑
const getPostStatusColor = (status: string) => {
  switch (status) {
    case 'PUBLISHED': return 'success';
    case 'DRAFT': return 'warning';
    case 'PENDING': return 'info';
    case 'PRIVATE': return 'error';
    case 'TRASH': return 'default';
    default: return 'default';
  }
};

// 게시물 타입 색상 매핑
const getPostTypeColor = (type: string) => {
  switch (type) {
    case 'POST': return 'primary';
    case 'PAGE': return 'secondary';
    case 'ATTACHMENT': return 'info';
    case 'REVISION': return 'warning';
    case 'MENU_ITEM': return 'success';
    default: return 'default';
  }
};

// 커스텀 상태 필드
const PostStatusField = ({ record }: any) => (
  <Chip
    icon={<Article />}
    label={record?.postStatus || 'UNKNOWN'}
    color={getPostStatusColor(record?.postStatus)}
    size="small"
  />
);

// 커스텀 타입 필드
const PostTypeField = ({ record }: any) => (
  <Chip
    label={record?.postType || 'UNKNOWN'}
    color={getPostTypeColor(record?.postType)}
    size="small"
    variant="outlined"
  />
);

// 커스텀 조회수 필드
const ViewCountField = ({ record }: any) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <Visibility fontSize="small" color="action" />
    <Typography variant="body2">
      {record?.viewCount?.toLocaleString() || '0'}
    </Typography>
  </Box>
);

// 커스텀 댓글 수 필드
const CommentCountField = ({ record }: any) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    <Comment fontSize="small" color="action" />
    <Typography variant="body2">
      {record?.commentCount || '0'}
    </Typography>
  </Box>
);

// 커스텀 대표 이미지 필드
const FeaturedImageField = ({ record }: any) => {
  if (!record?.featuredImage) {
    return <Typography variant="body2" color="textSecondary">-</Typography>;
  }

  return (
    <Avatar
      src={record.featuredImage}
      alt={record.title}
      sx={{ width: 40, height: 40 }}
      variant="rounded"
    >
      <Article />
    </Avatar>
  );
};

// 검색 필터
const postFilters = [
  <SearchInput source="q" placeholder="제목, 내용 검색" alwaysOn />,
  <TextInput source="title" label="제목" />,
  <TextInput source="slug" label="슬러그" />,
  <ReferenceInput
    source="authorUuid"
    reference="privates/users"
    label="작성자"
  >
    <SelectInput optionText="name" />
  </ReferenceInput>,
  <SelectInput
    source="postType"
    label="게시물 타입"
    choices={[
      { id: 'POST', name: '게시물' },
      { id: 'PAGE', name: '페이지' },
      { id: 'ATTACHMENT', name: '첨부파일' },
      { id: 'REVISION', name: '리비전' },
      { id: 'MENU_ITEM', name: '메뉴 아이템' },
    ]}
  />,
  <SelectInput
    source="postStatus"
    label="상태"
    choices={[
      { id: 'PUBLISHED', name: '게시됨' },
      { id: 'DRAFT', name: '임시저장' },
      { id: 'PENDING', name: '검토중' },
      { id: 'PRIVATE', name: '비공개' },
      { id: 'TRASH', name: '휴지통' },
    ]}
  />,
  <BooleanInput source="isPasswordProtected" label="비밀번호 보호" />,
  <BooleanInput source="allowComments" label="댓글 허용" />,
  <BooleanInput source="allowPings" label="핑백 허용" />,
  <DateInput source="publishedAt" label="게시일" />,
  <DateInput source="createdAt" label="생성일" />,
];

// 상단 툴바
const PostListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
    <SelectColumnsButton />
  </TopToolbar>
);

// 벌크 액션
const PostBulkActionButtons = () => (
  <>
    <BulkDeleteButton />
  </>
);

export const PostList = () => (
  <List
    filters={postFilters}
    actions={<PostListActions />}
    perPage={25}
    sort={{ field: 'createdAt', order: 'DESC' }}
  >
    <DatagridConfigurable
      bulkActionButtons={<PostBulkActionButtons />}
      rowClick="edit"
    >
      <TextField source="id" label="ID" />
      <TextField source="uuid" label="UUID" />
      
      <FeaturedImageField source="featuredImage" label="대표 이미지" />
      
      <TextField source="title" label="제목" />
      <TextField source="slug" label="슬러그" />
      
      <PostTypeField source="postType" label="타입" />
      <PostStatusField source="postStatus" label="상태" />
      
      <ReferenceField 
        source="authorUuid" 
        reference="privates/users" 
        label="작성자"
      >
        <TextField source="name" />
      </ReferenceField>
      
      <TextField source="excerpt" label="요약" />
      
      <ViewCountField source="viewCount" label="조회수" />
      <CommentCountField source="commentCount" label="댓글수" />
      
      <BooleanField source="isPasswordProtected" label="비밀번호 보호" />
      <BooleanField source="allowComments" label="댓글 허용" />
      <BooleanField source="allowPings" label="핑백 허용" />
      
      <NumberField source="menuOrder" label="메뉴 순서" />
      
      <DateField source="publishedAt" label="게시일" showTime />
      <DateField source="createdAt" label="생성일" showTime />
      <DateField source="updatedAt" label="수정일" showTime />
      
      <EditButton />
      <ShowButton />
      <DeleteButton />
    </DatagridConfigurable>
  </List>
);

export default PostList;
