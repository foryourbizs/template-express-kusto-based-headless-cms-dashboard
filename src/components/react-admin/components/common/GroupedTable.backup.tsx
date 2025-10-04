import React, { useState, useRef, useEffect } from 'react';
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
  IconButton,
  useTheme,
  useMediaQuery,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper
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
  minWidth?: string | number;
  maxWidth?: string | number;
  flex?: number;
  render?: (value: any, record: any) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  hideOnMobile?: boolean; // 모바일에서 숨길 컬럼
  priority?: number; // 우선순위 (낮을수록 먼저 숨겨짐)
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const containerRef = useRef<HTMLDivElement>(null);
  const [deleteOne] = useDelete();
  const notify = useNotify();
  const refresh = useRefresh();

  // 반응형 컬럼 필터링
  const getVisibleColumns = () => {
    let visibleColumns = [...columns];
    
    // 모바일에서 우선순위가 낮은 컬럼들 숨기기
    if (isMobile) {
      visibleColumns = visibleColumns.filter(col => !col.hideOnMobile);
      // 우선순위에 따라 추가 필터링
      if (visibleColumns.length > 3) {
        visibleColumns = visibleColumns
          .sort((a, b) => (a.priority || 0) - (b.priority || 0))
          .slice(0, 3);
      }
    } else if (isTablet) {
      // 태블릿에서는 우선순위 낮은 컬럼 일부만 숨기기
      if (visibleColumns.length > 5) {
        visibleColumns = visibleColumns
          .sort((a, b) => (a.priority || 0) - (b.priority || 0))
          .slice(0, 5);
      }
    }

    // 액션 컬럼 추가
    return [
      ...visibleColumns,
      {
        key: 'actions',
        label: '작업',
        width: isMobile ? '80px' : '120px',
        minWidth: isMobile ? '80px' : '120px',
        maxWidth: isMobile ? '80px' : '120px',
        align: 'center' as const,
        priority: 999, // 항상 표시
        render: (_, record) => customActions ? customActions(record) : (
          <EditButton record={record} resourceName={resourceName} onEdit={onEdit} />
        )
      } as TableColumn
    ];
  };

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
  const visibleColumns = getVisibleColumns();

  return (
    <Box sx={{ mb: 3 }}>
      {/* 그룹 헤더 */}
      <Box sx={{ 
        p: isMobile ? 1.5 : 2, 
        backgroundColor: 'primary.main', 
        color: 'primary.contrastText',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        alignItems: 'center',
        flexWrap: isMobile ? 'wrap' : 'nowrap',
        gap: 1,
        justifyContent: 'space-between'
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          minWidth: 0,
          flex: 1
        }}>
          {groupIcon}
          <Typography 
            variant={isMobile ? "subtitle1" : "h6"} 
            sx={{ 
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}
          >
            {groupData.groupName}
          </Typography>
          <Chip 
            label={`${groupData.items.length}개`} 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'inherit',
              minWidth: 'fit-content'
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
            px: isMobile ? 1 : 2,
            py: 0.5,
            minWidth: 'fit-content'
          }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 600,
                color: 'inherit',
                textShadow: '0 1px 2px rgba(0,0,0,0.3)',
                whiteSpace: 'nowrap'
              }}
            >
              {selectedIds.length}개 선택
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
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        )}
      </Box>
      
      {/* 반응형 테이블 컨테이너 */}
      <TableContainer 
        component={Paper} 
        ref={containerRef}
        sx={{ 
          border: '1px solid',
          borderColor: 'divider',
          borderTop: 'none',
          borderRadius: '0 0 4px 4px',
          maxHeight: isMobile ? '70vh' : 'none',
          '& .MuiTable-root': {
            minWidth: isMobile ? '600px' : 'auto' // 모바일에서 최소 너비 보장
          }
        }}
      >
        <Table stickyHeader={isMobile} size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'rgba(25, 118, 210, 0.08)' }}>
              {enableSelection && (
                <TableCell 
                  padding="checkbox"
                  sx={{ 
                    width: '48px',
                    minWidth: '48px',
                    position: 'sticky',
                    left: 0,
                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                    zIndex: 2
                  }}
                >
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleToggleSelectAll}
                    size="small"
                  />
                </TableCell>
              )}
              {visibleColumns.map((column, index) => (
                <TableCell 
                  key={column.key}
                  align={column.align || 'left'}
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    whiteSpace: 'nowrap',
                    minWidth: column.minWidth || (isMobile ? '80px' : '120px'),
                    maxWidth: column.maxWidth,
                    width: column.width,
                    ...(isMobile && index === 0 && enableSelection ? {
                      position: 'sticky',
                      left: '48px',
                      backgroundColor: 'rgba(25, 118, 210, 0.08)',
                      zIndex: 1
                    } : {})
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {groupData.items.map((item) => (
              <TableRow 
                key={item.id}
                hover
                selected={selectedIds.includes(item.id)}
                onClick={() => onRowClick && onRowClick(item)}
                sx={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&.Mui-selected': {
                    backgroundColor: 'action.selected'
                  }
                }}
              >
                {enableSelection && (
                  <TableCell 
                    padding="checkbox"
                    sx={{ 
                      position: 'sticky',
                      left: 0,
                      backgroundColor: selectedIds.includes(item.id) ? 'action.selected' : 'background.paper',
                      zIndex: 2
                    }}
                  >
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => handleToggleSelection(item.id)}
                      size="small"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((column, index) => (
                  <TableCell 
                    key={column.key}
                    align={column.align || 'left'}
                    sx={{ 
                      minWidth: column.minWidth || (isMobile ? '80px' : '120px'),
                      maxWidth: column.maxWidth,
                      width: column.width,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      ...(isMobile && index === 0 && enableSelection ? {
                        position: 'sticky',
                        left: '48px',
                        backgroundColor: selectedIds.includes(item.id) ? 'action.selected' : 'background.paper',
                        zIndex: 1
                      } : {})
                    }}
                  >
                    {column.render 
                      ? column.render(item[column.key], item)
                      : (item[column.key] || '-')
                    }
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupedTable;