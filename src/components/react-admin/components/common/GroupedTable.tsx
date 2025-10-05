import React, { useState, useRef, useMemo } from 'react';
import {
  Box,
  Typography,
  Chip,
  IconButton,
  Checkbox,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  useTheme,
  useMediaQuery,
  Theme,
  TablePagination,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Menu,
  MenuList,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import {
  useRecordContext,
  useResourceContext,
  useCanAccess,
  useRedirect,
  useCreatePath,
  useEditContext,
  useShowContext,
} from 'react-admin';

// 타입 정의 export
export interface TableColumn {
  key: string;
  label: string;
  align?: 'left' | 'center' | 'right';
  minWidth?: string;
  maxWidth?: string;
  width?: string;
  hideOnMobile?: boolean;
  flex?: number;
  priority?: number;
  render?: (value: any, item: any) => React.ReactNode;
}

export interface GroupedTableData {
  groupName: string;
  groupKey?: string;
  items: any[];
}

interface PaginationConfig {
  enabled?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showFirstLastButtons?: boolean;
  showPageNumbers?: boolean; // 페이지 숫자 버튼 표시 여부
  maxPageButtons?: number; // 표시할 최대 페이지 버튼 수
  position?: 'top' | 'bottom' | 'both';
  mode?: 'group' | 'global'; // 그룹별 페이징 vs 전체 페이징
}

interface CrudActions {
  enableCreate?: boolean;
  enableEdit?: boolean;
  enableShow?: boolean;
  enableDelete?: boolean;
  resource?: string; // React Admin 리소스 이름
  customActions?: Array<{
    label: string;
    icon: React.ReactNode;
    onClick: (item: any) => void;
    show?: (item: any) => boolean;
  }>;
}

interface GroupedTableProps {
  groupData: GroupedTableData;
  columns: TableColumn[];
  enableSelection?: boolean;
  enableBulkDelete?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  onRowClick?: (item: any) => void;
  groupIcon?: React.ReactNode;
  itemLabel?: string;
  pagination?: PaginationConfig;
  groupId?: string; // 그룹별 페이징을 위한 고유 ID
  crudActions?: CrudActions; // CRUD 액션 설정
}

// 행별 액션 버튼 컴포넌트
const RowActions: React.FC<{ 
  item: any; 
  crudActions?: CrudActions;
  onEdit?: (item: any) => void;
  onShow?: (item: any) => void;
  onDelete?: (item: any) => void;
}> = ({ item, crudActions, onEdit, onShow, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const redirect = useRedirect();
  const createPath = useCreatePath();
  
  // React Admin 권한 체크
  const resource = crudActions?.resource || '';
  const editAccess = useCanAccess({ 
    action: 'edit', 
    resource, 
    record: item 
  });
  const showAccess = useCanAccess({ 
    action: 'show', 
    resource, 
    record: item 
  });
  const deleteAccess = useCanAccess({ 
    action: 'delete', 
    resource, 
    record: item 
  });

  const canEdit = editAccess.canAccess;
  const canShow = showAccess.canAccess;
  const canDelete = deleteAccess.canAccess;

  if (!crudActions) return null;

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(item);
    } else if (resource && item.id) {
      redirect('edit', resource, item.id);
    }
    handleMenuClose();
  };

  const handleShow = () => {
    if (onShow) {
      onShow(item);
    } else if (resource && item.id) {
      redirect('show', resource, item.id);  
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(item);
    }
    handleMenuClose();
  };

  const availableActions = [
    ...(crudActions.enableShow && canShow ? [{
      label: '보기',
      icon: <ViewIcon fontSize="small" />,
      onClick: handleShow
    }] : []),
    ...(crudActions.enableEdit && canEdit ? [{
      label: '수정',
      icon: <EditIcon fontSize="small" />,
      onClick: handleEdit
    }] : []),
    ...(crudActions.enableDelete && canDelete ? [{
      label: '삭제',
      icon: <DeleteIcon fontSize="small" />,
      onClick: handleDelete
    }] : []),
    ...(crudActions.customActions?.filter(action => 
      !action.show || action.show(item)
    ) || [])
  ];

  if (availableActions.length === 0) return null;

  // 액션이 1개면 직접 버튼, 2개 이상이면 메뉴
  if (availableActions.length === 1) {
    const action = availableActions[0];
    return (
      <IconButton 
        size="small" 
        onClick={action.onClick}
        title={action.label}
      >
        {action.icon}
      </IconButton>
    );
  }

  return (
    <>
      <IconButton size="small" onClick={handleMenuOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 120 }
        }}
      >
        {availableActions.map((action, index) => (
          <MenuItem key={index} onClick={action.onClick}>
            <ListItemIcon>
              {action.icon}
            </ListItemIcon>
            <ListItemText primary={action.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

// 생성 버튼 컴포넌트
const CreateButton: React.FC<{ crudActions: CrudActions }> = ({ crudActions }) => {
  const redirect = useRedirect();
  const resource = crudActions.resource || '';
  
  const createAccess = useCanAccess({ 
    action: 'create', 
    resource 
  });

  if (!createAccess.canAccess) return null;

  const handleCreate = () => {
    if (resource) {
      redirect('create', resource);
    }
  };

  return (
    <Button
      variant="contained"
      size="small"
      startIcon={<AddIcon />}
      onClick={handleCreate}
      sx={{
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: 'inherit',
        '&:hover': {
          backgroundColor: 'rgba(255,255,255,0.25)'
        }
      }}
    >
      생성
    </Button>
  );
};

const GroupedTable: React.FC<GroupedTableProps> = ({
  groupData,
  columns,
  enableSelection = false,
  enableBulkDelete = false,
  selectedIds = [],
  onSelectionChange,
  onBulkDelete,
  onRowClick,
  groupIcon,
  itemLabel = '항목',
  pagination = { enabled: false },
  groupId,
  crudActions
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const containerRef = useRef<HTMLDivElement>(null);

  // 로컬 선택 상태 관리
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);
  const currentSelectedIds = onSelectionChange ? selectedIds : localSelectedIds;

  // 페이지네이션 상태 관리 (각 컴포넌트별로 독립적)
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pagination.pageSize || 10);

  // 페이지네이션 설정
  const paginationConfig = {
    enabled: pagination.enabled || false,
    pageSize: pagination.pageSize || 10,
    pageSizeOptions: pagination.pageSizeOptions || [5, 10, 25, 50],
    showFirstLastButtons: pagination.showFirstLastButtons !== false,
    showPageNumbers: pagination.showPageNumbers !== false, // 기본값 true
    maxPageButtons: pagination.maxPageButtons || 5, // 기본값 5개
    position: pagination.position || 'bottom'
  };

  const handleToggleSelection = (id: string) => {
    const newSelection = currentSelectedIds.includes(id)
      ? currentSelectedIds.filter(selectedId => selectedId !== id)
      : [...currentSelectedIds, id];
    
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setLocalSelectedIds(newSelection);
    }
  };

  const handleToggleSelectAll = () => {
    let newSelection: string[];
    if (isAllSelected) {
      // 현재 페이지의 모든 항목 선택 해제
      newSelection = currentSelectedIds.filter(id => !currentPageItemIds.includes(id));
    } else {
      // 현재 페이지의 모든 항목 선택
      const newIds = currentPageItemIds.filter(id => !currentSelectedIds.includes(id));
      newSelection = [...currentSelectedIds, ...newIds];
    }
    
    if (onSelectionChange) {
      onSelectionChange(newSelection);
    } else {
      setLocalSelectedIds(newSelection);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && currentSelectedIds.length > 0) {
      onBulkDelete(currentSelectedIds);
    }
  };

  // 페이지네이션 핸들러
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  // 페이지네이션 적용된 데이터 계산
  const paginatedItems = useMemo(() => {
    console.log(`[${groupData.groupName}] 페이지네이션 계산:`, {
      totalItems: groupData.items.length,
      page,
      rowsPerPage,
      enabled: paginationConfig.enabled
    });
    
    if (!paginationConfig.enabled) {
      return groupData.items;
    }
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const result = groupData.items.slice(startIndex, endIndex);
    
    console.log(`[${groupData.groupName}] 페이지네이션 결과:`, {
      startIndex,
      endIndex,
      resultCount: result.length
    });
    
    return result;
  }, [groupData.items, page, rowsPerPage, paginationConfig.enabled, groupData.groupName]);

  // 모바일에서 숨김 처리된 컬럼 필터링
  const visibleColumns = columns.filter(column => !(column.hideOnMobile && isMobile));

  // 선택 상태 계산 (페이지네이션 적용 시 현재 페이지 기준)
  const currentPageItems = paginatedItems;
  const currentPageItemIds = currentPageItems.map(item => item.id);
  const currentPageSelectedIds = currentSelectedIds.filter(id => currentPageItemIds.includes(id));
  
  const isAllSelected = currentPageSelectedIds.length === currentPageItems.length && currentPageItems.length > 0;
  const isIndeterminate = currentPageSelectedIds.length > 0 && currentPageSelectedIds.length < currentPageItems.length;

  // 컬럼 너비 계산
  const getColumnStyle = (column: TableColumn) => ({
    minWidth: column.minWidth || (isMobile ? '80px' : '120px'),
    maxWidth: column.maxWidth,
    width: column.width,
    flexShrink: 0
  });

  // 페이지네이션 컴포넌트
  const PaginationComponent = () => {
    if (!paginationConfig.enabled) return null;
    
    const totalCount = groupData.items.length;
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    const currentPage = Math.min(page, totalPages - 1) + 1; // 1-based for display
    
    console.log(`[${groupData.groupName}] 페이지네이션 상태:`, {
      page,
      rowsPerPage,
      totalCount,
      totalPages
    });

    // 페이지 숫자 버튼을 표시하는지 여부에 따라 다른 컴포넌트 사용
    if (paginationConfig.showPageNumbers) {
      return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* 페이지 크기 선택 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              페이지당 항목 수:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={rowsPerPage}
                onChange={(e) => handleChangeRowsPerPage(e as any)}
                variant="outlined"
              >
                {paginationConfig.pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 페이지 번호 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, newPage) => handleChangePage(event, newPage - 1)} // Convert back to 0-based
              siblingCount={Math.floor(paginationConfig.maxPageButtons / 2)}
              boundaryCount={1}
              showFirstButton={paginationConfig.showFirstLastButtons}
              showLastButton={paginationConfig.showFirstLastButtons}
              size={isMobile ? "small" : "medium"}
              shape="rounded"
              color="primary"
            />
          </Box>

          {/* 항목 정보 */}
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            {totalCount > 0 
              ? `${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, totalCount)} / ${totalCount}`
              : '0 / 0'
            }
          </Typography>
        </Box>
      );
    }

    // 기본 TablePagination 사용
    return (
      <TablePagination
        component="div"
        count={totalCount}
        page={Math.min(page, totalPages - 1)} // 페이지가 범위를 벗어나지 않도록 보정
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={paginationConfig.pageSizeOptions}
        showFirstButton={paginationConfig.showFirstLastButtons}
        showLastButton={paginationConfig.showFirstLastButtons}
        labelRowsPerPage="페이지당 항목 수:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      />
    );
  };

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      {/* 그룹 헤더 - 고정 폭 */}
      <Box sx={{ 
        p: isMobile ? 1.5 : 2, 
        backgroundColor: 'primary.main', 
        color: 'primary.contrastText',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        alignItems: 'center',
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
            label={`${groupData.items.length}개 ${itemLabel}`} 
            size="small" 
            sx={{ 
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'inherit',
              flexShrink: 0
            }} 
          />
        </Box>
        
        {/* 액션 버튼들 */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* 생성 버튼 */}
          {crudActions?.enableCreate && (
            <CreateButton crudActions={crudActions} />
          )}
          
          {/* 선택된 항목 표시 및 삭제 버튼 */}
          {enableBulkDelete && enableSelection && currentSelectedIds.length > 0 && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              backgroundColor: 'rgba(255,255,255,0.15)',
              borderRadius: 1,
              px: isMobile ? 1 : 2,
              py: 0.5,
              flexShrink: 0
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
                {currentSelectedIds.length}개 선택
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
      </Box>
      
      {/* 테이블 컨테이너 - Material-UI Table 사용 */}
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
            minWidth: isMobile ? '600px' : 'auto'
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
              {crudActions && (
                <TableCell 
                  align="center"
                  sx={{ 
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    width: '80px',
                    minWidth: '80px'
                  }}
                >
                  액션
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageItems.map((item) => (
              <TableRow 
                key={item.id}
                hover
                selected={currentSelectedIds.includes(item.id)}
                onClick={() => onRowClick && onRowClick(item)}
                sx={{ 
                  cursor: onRowClick ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: onRowClick ? 'action.hover' : 'inherit'
                  }
                }}
              >
                {enableSelection && (
                  <TableCell 
                    padding="checkbox"
                    sx={{ 
                      position: 'sticky',
                      left: 0,
                      backgroundColor: currentSelectedIds.includes(item.id) ? 'action.selected' : 'background.paper',
                      zIndex: 1
                    }}
                  >
                    <Checkbox
                      checked={currentSelectedIds.includes(item.id)}
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
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      minWidth: column.minWidth || (isMobile ? '80px' : '120px'),
                      maxWidth: column.maxWidth,
                      width: column.width,
                      fontSize: isMobile ? '0.8rem' : '0.875rem',
                      py: isMobile ? 0.5 : 1,
                      ...(isMobile && index === 0 && enableSelection ? {
                        position: 'sticky',
                        left: '48px',
                        backgroundColor: currentSelectedIds.includes(item.id) ? 'action.selected' : 'background.paper',
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
                {crudActions && (
                  <TableCell 
                    align="center"
                    sx={{ 
                      width: '80px',
                      minWidth: '80px',
                      py: isMobile ? 0.5 : 1
                    }}
                    onClick={(e) => e.stopPropagation()} // 행 클릭 이벤트 방지
                  >
                    <RowActions 
                      item={item} 
                      crudActions={crudActions}
                    />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 하단 페이지네이션 */}
      {(paginationConfig.position === 'bottom' || paginationConfig.position === 'both') && 
        <PaginationComponent />
      }
    </Box>
  );
};

// 다중 그룹 테이블 Props
interface MultiGroupTableProps {
  groupedData: GroupedTableData[];
  columns: TableColumn[];
  enableSelection?: boolean;
  enableBulkDelete?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onBulkDelete?: (selectedIds: string[]) => void;
  onRowClick?: (item: any) => void;
  groupIcon?: React.ReactNode;
  itemLabel?: string;
  pagination?: PaginationConfig;
  crudActions?: CrudActions; // CRUD 액션 설정
}

// 다중 그룹 테이블 컴포넌트
export const MultiGroupTable: React.FC<MultiGroupTableProps> = ({
  groupedData,
  columns,
  enableSelection = false,
  enableBulkDelete = false,
  selectedIds = [],
  onSelectionChange,
  onBulkDelete,
  onRowClick,
  groupIcon,
  itemLabel = '항목',
  pagination = { enabled: false },
  crudActions
}) => {
  const paginationConfig = {
    enabled: pagination.enabled || false,
    pageSize: pagination.pageSize || 10,
    pageSizeOptions: pagination.pageSizeOptions || [5, 10, 25, 50],
    showFirstLastButtons: pagination.showFirstLastButtons !== false,
    showPageNumbers: pagination.showPageNumbers !== false, // 기본값 true
    maxPageButtons: pagination.maxPageButtons || 5, // 기본값 5개
    position: pagination.position || 'bottom',
    mode: pagination.mode || 'group'
  };

  // 전체 페이징 모드에서 사용할 Hooks - 항상 호출되어야 함
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(paginationConfig.pageSize);
  
  // 모든 아이템을 하나의 배열로 합치고 그룹 정보 유지
  const allItems = useMemo(() => {
    return groupedData.flatMap(group => 
      group.items.map(item => ({
        ...item,
        _groupName: group.groupName,
        _groupKey: group.groupKey
      }))
    );
  }, [groupedData]);

  // 페이지네이션 적용
  const paginatedItems = useMemo(() => {
    if (!paginationConfig.enabled) {
      return allItems;
    }
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return allItems.slice(startIndex, endIndex);
  }, [allItems, page, rowsPerPage, paginationConfig.enabled]);

  // 현재 페이지의 그룹별 데이터 재구성
  const currentPageGroupedData = useMemo(() => {
    const grouped = new Map<string, GroupedTableData>();
    
    paginatedItems.forEach(item => {
      const groupKey = item._groupKey || 'default';
      const groupName = item._groupName || '기타';
      
      if (!grouped.has(groupKey)) {
        grouped.set(groupKey, {
          groupKey,
          groupName,
          items: []
        });
      }
      
      const { _groupName, _groupKey, ...originalItem } = item;
      grouped.get(groupKey)!.items.push(originalItem);
    });

    return Array.from(grouped.values());
  }, [paginatedItems]);

  // 페이지네이션 핸들러
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // 페이지네이션 컴포넌트
  const PaginationComponent = () => {
    if (!paginationConfig.enabled) return null;
    
    const totalCount = allItems.length;
    const totalPages = Math.ceil(totalCount / rowsPerPage);
    const currentPage = Math.min(page, totalPages - 1) + 1; // 1-based for display

    // 페이지 숫자 버튼을 표시하는지 여부에 따라 다른 컴포넌트 사용
    if (paginationConfig.showPageNumbers) {
      return (
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          flexWrap: 'wrap',
          gap: 2
        }}>
          {/* 페이지 크기 선택 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
              페이지당 항목 수:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select
                value={rowsPerPage}
                onChange={(e) => handleChangeRowsPerPage(e as any)}
                variant="outlined"
              >
                {paginationConfig.pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* 페이지 번호 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, newPage) => handleChangePage(event, newPage - 1)} // Convert back to 0-based
              siblingCount={Math.floor(paginationConfig.maxPageButtons / 2)}
              boundaryCount={1}
              showFirstButton={paginationConfig.showFirstLastButtons}
              showLastButton={paginationConfig.showFirstLastButtons}
              size="medium"
              shape="rounded"
              color="primary"
            />
          </Box>

          {/* 항목 정보 */}
          <Typography variant="body2" sx={{ whiteSpace: 'nowrap' }}>
            {totalCount > 0 
              ? `${page * rowsPerPage + 1}–${Math.min((page + 1) * rowsPerPage, totalCount)} / ${totalCount}`
              : '0 / 0'
            }
          </Typography>
        </Box>
      );
    }

    // 기본 TablePagination 사용
    return (
      <TablePagination
        component="div"
        count={totalCount}
        page={Math.min(page, totalPages - 1)}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={paginationConfig.pageSizeOptions}
        showFirstButton={paginationConfig.showFirstLastButtons}
        showLastButton={paginationConfig.showFirstLastButtons}
        labelRowsPerPage="페이지당 항목 수:"
        labelDisplayedRows={({ from, to, count }) => 
          `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`
        }
        sx={{
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          justifyContent: 'center'
        }}
      />
    );
  };

  // 그룹별 페이징 모드
  if (paginationConfig.mode === 'group') {
    return (
      <Box>
        {groupedData.map((groupData) => (
          <GroupedTable
            key={groupData.groupKey}
            groupData={groupData}
            columns={columns}
            enableSelection={enableSelection}
            enableBulkDelete={enableBulkDelete}
            selectedIds={selectedIds}
            onSelectionChange={onSelectionChange}
            onBulkDelete={onBulkDelete}
            onRowClick={onRowClick}
            groupIcon={groupIcon}
            itemLabel={itemLabel}
            pagination={pagination}
            groupId={groupData.groupKey}
            crudActions={crudActions}
          />
        ))}
      </Box>
    );
  }

  // 전체 페이징 모드
  return (
    <Box>
      {/* 전체 아이템 수 표시 */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: 'primary.main', 
        color: 'primary.contrastText',
        borderRadius: '4px 4px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        justifyContent: 'center'
      }}>
        {groupIcon}
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          전체 {itemLabel}
        </Typography>
        <Chip 
          label={`${allItems.length}개`} 
          size="small" 
          sx={{ 
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'inherit'
          }} 
        />
      </Box>

      {/* 상단 페이지네이션 */}
      {(paginationConfig.position === 'top' || paginationConfig.position === 'both') && 
        <PaginationComponent />
      }

      {/* 현재 페이지의 그룹별 테이블들 */}
      {currentPageGroupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={columns}
          enableSelection={enableSelection}
          enableBulkDelete={enableBulkDelete}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onBulkDelete={onBulkDelete}
          onRowClick={onRowClick}
          groupIcon={groupIcon}
          itemLabel={itemLabel}
          pagination={{ enabled: false }} // 개별 그룹은 페이징 비활성화
          crudActions={crudActions}
        />
      ))}

      {/* 하단 페이지네이션 */}
      {(paginationConfig.position === 'bottom' || paginationConfig.position === 'both') && 
        <PaginationComponent />
      }
    </Box>
  );
};

export default GroupedTable;