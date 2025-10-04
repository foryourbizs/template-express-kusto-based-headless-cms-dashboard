import React, { useState } from 'react';
import {
  useDelete,
  useNotify,
  useRefresh,
  Button,
  useRedirect
} from 'react-admin';
import {
  Box,
  Typography,
  Chip,
  Checkbox,
  IconButton
} from '@mui/material';
import {
  Folder,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// 컬럼 정의 타입
export interface TableColumn {
  key: string;
  label: string;
  width?: string | number;
  flex?: number;
  render?: (value: any, record: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

// 테이블 데이터 타입
export interface TableData {
  id: string | number;
  [key: string]: any;
}

// 그룹 데이터 타입
export interface GroupedTableData {
  groupKey: string;
  groupName: string;
  items: TableData[];
}

// 프롭스 타입
interface GroupedTableProps {
  groupData: GroupedTableData;
  columns: TableColumn[];
  resourceName: string;
  onEdit?: (record: TableData) => void;
  enableBulkDelete?: boolean;
  enableSelection?: boolean;
  customActions?: (record: TableData) => React.ReactNode;
  groupIcon?: React.ReactNode;
  itemLabel?: string; // "메뉴", "사용자" 등
  onRowClick?: (record: TableData) => void;
}

// 편집 버튼 컴포넌트
const EditButton = ({ 
  record, 
  resourceName, 
  onEdit 
}: { 
  record: TableData; 
  resourceName: string; 
  onEdit?: (record: TableData) => void; 
}) => {
  const redirect = useRedirect();
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(record);
    } else {
      redirect('edit', resourceName, record.id);
    }
  };

  return (
    <Button
      onClick={handleEditClick}
      color="primary"
      size="small"
      startIcon={<EditIcon />}
    >
      편집
    </Button>
  );
};

// 범용 그룹별 테이블 컴포넌트
export const GroupedTable: React.FC<GroupedTableProps> = ({
  groupData,
  columns,
  resourceName,
  onEdit,
  enableBulkDelete = true,
  enableSelection = true,
  customActions,
  groupIcon = <Folder />,
  itemLabel = "항목",
  onRowClick
}) => {
  const [selectedIds, setSelectedIds] = useState<(string | number)[]>([]);
  const [deleteOne] = useDelete();
  const notify = useNotify();
  const refresh = useRefresh();

  // 개별 체크박스 핸들러
  const handleToggleSelection = (id: string | number) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  // 전체 선택/해제 핸들러
  const handleToggleSelectAll = () => {
    if (selectedIds.length === groupData.items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(groupData.items.map(item => item.id));
    }
  };

  // 선택된 항목들 삭제
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    
    try {
      await Promise.all(
        selectedIds.map(id => 
          deleteOne(resourceName, { id })
        )
      );
      notify(`${selectedIds.length}개 ${itemLabel}이(가) 삭제되었습니다`, { type: 'info' });
      setSelectedIds([]);
      refresh();
    } catch (error: any) {
      notify(`삭제 중 오류가 발생했습니다: ${error.message}`, { type: 'error' });
    }
  };

  const isAllSelected = selectedIds.length === groupData.items.length && groupData.items.length > 0;
  const isIndeterminate = selectedIds.length > 0 && selectedIds.length < groupData.items.length;

  // 기본 컬럼에 편집 액션 추가
  const allColumns: TableColumn[] = [
    ...columns,
    {
      key: 'actions',
      label: '작업',
      width: '100px',
      render: (_, record) => customActions ? customActions(record) : (
        <EditButton record={record} resourceName={resourceName} onEdit={onEdit} />
      )
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      {/* 그룹 헤더 */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'primary.contrastText',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {groupIcon}
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {groupData.groupName}
          </Typography>
          <Chip 
            label={`${groupData.items.length}개 ${itemLabel}`} 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'inherit'
            }} 
          />
        </Box>
        
        {/* 선택된 항목 표시 및 삭제 버튼 */}
        {enableBulkDelete && enableSelection && selectedIds.length > 0 && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 1,
            px: 2,
            py: 0.5
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: 'inherit',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)'
              }}
            >
              {selectedIds.length}개 선택됨
            </Typography>
            <IconButton
              onClick={handleBulkDelete}
              size="small"
              sx={{ 
                color: 'inherit',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        )}
      </Box>
      
      {/* 커스텀 테이블 */}
      <Box sx={{ 
        border: '1px solid',
        borderColor: 'divider',
        borderTop: 'none',
        borderRadius: '0 0 4px 4px',
        overflow: 'hidden'
      }}>
        {/* 테이블 헤더 */}
        <Box sx={{ 
          display: 'flex',
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
          borderBottom: '1px solid',
          borderColor: 'divider',
          minHeight: '52px',
          alignItems: 'center'
        }}>
          {enableSelection && (
            <Box sx={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={handleToggleSelectAll}
                size="small"
              />
            </Box>
          )}
          {allColumns.map((column) => (
            <Box 
              key={column.key}
              sx={{ 
                width: column.width,
                flex: column.flex || (column.width ? 0 : 1),
                px: 2, 
                fontWeight: 600, 
                fontSize: '0.875rem',
                textAlign: column.align || 'left'
              }}
            >
              {column.label}
            </Box>
          ))}
        </Box>
        
        {/* 테이블 바디 */}
        {groupData.items.map((item, index) => (
          <Box 
            key={item.id}
            sx={{ 
              display: 'flex',
              borderBottom: index < groupData.items.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
              minHeight: '52px',
              alignItems: 'center',
              backgroundColor: selectedIds.includes(item.id) ? 'action.selected' : 'inherit',
              '&:hover': {
                backgroundColor: 'action.hover'
              },
              cursor: onRowClick ? 'pointer' : 'default'
            }}
            onClick={() => onRowClick && onRowClick(item)}
          >
            {enableSelection && (
              <Box sx={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
                <Checkbox
                  checked={selectedIds.includes(item.id)}
                  onChange={() => handleToggleSelection(item.id)}
                  size="small"
                  onClick={(e) => e.stopPropagation()}
                />
              </Box>
            )}
            {allColumns.map((column) => (
              <Box 
                key={column.key}
                sx={{ 
                  width: column.width,
                  flex: column.flex || (column.width ? 0 : 1),
                  px: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  textAlign: column.align || 'left'
                }}
              >
                {column.render 
                  ? column.render(item[column.key], item)
                  : (item[column.key] || '-')
                }
              </Box>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default GroupedTable;