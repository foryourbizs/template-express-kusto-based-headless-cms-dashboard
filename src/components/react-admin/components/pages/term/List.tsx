"use client";

import { 
  TextField, 
  DateField, 
  TextInput,
  FunctionField,
  useRecordContext,
} from 'react-admin';
import { GenericList } from '../../guesser/GenericList';
import { Chip, Box } from '@mui/material';

/**
 * Term List Component
 * 분류(Term) 목록 페이지
 */
export const TermList = () => {
  // 삭제 여부 표시 컴포넌트
  const DeletedStatusField = () => {
    const record = useRecordContext();
    if (!record) return null;

    return record.deletedAt ? (
      <Chip
        label="삭제됨"
        color="error"
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    ) : (
      <Chip
        label="활성"
        color="success"
        size="small"
        sx={{
          fontWeight: 600,
          fontSize: '0.75rem',
        }}
      />
    );
  };

  // 슬러그 미리보기 컴포넌트
  const SlugPreviewField = () => {
    const record = useRecordContext();
    if (!record || !record.slug) return null;

    return (
      <Box
        sx={{
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          color: 'primary.main',
          backgroundColor: 'action.hover',
          padding: '4px 8px',
          borderRadius: 1,
          display: 'inline-block',
        }}
      >
        /{record.slug}
      </Box>
    );
  };

  return (
    <GenericList
      columns={[
        <TextField 
          key="id" 
          source="id" 
          label="ID"
          sortable
        />,
        <TextField 
          key="name" 
          source="name" 
          label="분류명"
          sortable
        />,
        <FunctionField
          key="slug"
          label="URL 슬러그"
          sortable
          sortBy="slug"
          render={() => <SlugPreviewField />}
        />,
        <FunctionField
          key="status"
          label="상태"
          sortable={false}
          render={() => <DeletedStatusField />}
        />,
        <DateField 
          key="createdAt" 
          source="createdAt" 
          label="생성일시"
          showTime
          sortable
        />,
        <DateField 
          key="updatedAt" 
          source="updatedAt" 
          label="수정일시"
          showTime
          sortable
        />,
      ]}
      filters={[
        <TextInput
          key="search"
          source="q"
          label="검색"
          placeholder="분류명 또는 슬러그 검색..."
          alwaysOn
          sx={{ minWidth: { xs: '100%', sm: '300px' } }}
        />,
      ]}
      filterDefaultValues={{
        // 기본적으로 삭제되지 않은 항목만 표시
        // deletedAt: null
      }}
      defaultSort={{ field: 'id', order: 'DESC' }}
      perPage={25}
      paginationProps={{
        rowsPerPageOptions: [10, 25, 50, 100],
      }}
      rowClick="show"
      enableBulkActions={false}
      datagridProps={{
        optimized: true,
      }}
      headerCellSx={{
        fontWeight: 700,
        backgroundColor: 'action.hover',
      }}
      filterLayout="horizontal"
      alwaysShowFilters={false}
      queryOptions={{
        meta: {
          include: ['taxonomies']
        },
      }}
    />
  );
};

export default TermList;
