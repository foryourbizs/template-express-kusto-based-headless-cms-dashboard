import React, { useState } from 'react';
import {
  List,
  useListContext,
  CreateButton,
  TopToolbar,
  FilterButton,
  ExportButton,
  EditButton,
  ShowButton,
  DeleteButton,
  SearchInput,
  TextInput,
  SelectInput,
  useDelete,
  useNotify,
  useRefresh,
  Button,
} from 'react-admin';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Typography,
  IconButton,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
} from '@mui/material';
import {
  ExpandMore,
  ChevronRight,
  Folder,
  FolderOpen,
  Link,
  ExitToApp,
  TouchApp,
  Menu as MenuIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Public,
  Lock,
  Login,
} from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';

// 메뉴 타입 선택지
const menuTypeChoices = [
  { id: 'INTERNAL_LINK', name: '내부 링크' },
  { id: 'EXTERNAL_LINK', name: '외부 링크' },
  { id: 'BUTTON', name: '버튼' },
];

// 검색 필터
const siteMenuFilters = [
  <SearchInput source="q" placeholder="메뉴명, 설명 검색" alwaysOn />,
  <TextInput source="title" label="메뉴명" />,
  <TextInput source="groupKey" label="그룹키" />,
  <SelectInput
    source="type"
    label="메뉴 타입"
    choices={menuTypeChoices}
  />,
  <SelectInput
    source="isPublic"
    label="공개 여부"
    choices={[
      { id: true, name: '공개' },
      { id: false, name: '비공개' },
    ]}
  />,
];

// 메뉴 타입 아이콘 매핑
const getMenuTypeIcon = (type: string) => {
  switch (type) {
    case 'INTERNAL_LINK':
      return <Link fontSize="small" />;
    case 'EXTERNAL_LINK':
      return <ExitToApp fontSize="small" />;
    case 'BUTTON':
      return <TouchApp fontSize="small" />;
    default:
      return <Link fontSize="small" />;
  }
};

// 상단 툴바
const ListActions = () => (
  <TopToolbar>
    <FilterButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// 메뉴 아이템 컴포넌트
interface MenuItemProps {
  item: any;
  level: number;
  expanded: { [key: string]: boolean };
  onToggleExpand: (id: string) => void;
  onEdit: (id: string) => void;
  onShow: (id: string) => void;
  onDelete: (item: any) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  item,
  level,
  expanded,
  onToggleExpand,
  onEdit,
  onShow,
  onDelete,
}) => {
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expanded[item.id] || false;

  return (
    <>
      <TableRow 
        sx={{ 
          '&:hover': { 
            backgroundColor: 'action.hover' 
          },
          backgroundColor: level === 0 ? 'grey.50' : 'transparent'
        }}
      >
        {/* 메뉴명 (계층 구조 포함) */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* 들여쓰기 */}
            <Box sx={{ width: level * 24 }} />
            
            {/* 확장/축소 버튼 */}
            {hasChildren ? (
              <IconButton
                size="small"
                onClick={() => onToggleExpand(item.id)}
                sx={{ p: 0.5 }}
              >
                {isExpanded ? <ExpandMore /> : <ChevronRight />}
              </IconButton>
            ) : (
              <Box sx={{ width: 32 }} />
            )}
            
            {/* 폴더 아이콘 */}
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen fontSize="small" color="primary" />
              ) : (
                <Folder fontSize="small" color="primary" />
              )
            ) : (
              <Folder fontSize="small" color="action" />
            )}
            
            {/* 메뉴 제목 */}
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: level === 0 ? 600 : 400,
                color: level === 0 ? 'primary.main' : 'text.primary'
              }}
            >
              {item.title}
            </Typography>
            
            {/* 레벨 표시 */}
            {level > 0 && (
              <Chip 
                label={`L${level}`} 
                size="small" 
                variant="outlined" 
                sx={{ ml: 1, fontSize: '0.75rem', height: 20 }}
              />
            )}
          </Box>
        </TableCell>

        {/* 그룹키 */}
        <TableCell>
          <Chip
            label={item.groupKey}
            size="small"
            variant="outlined"
            color="primary"
          />
        </TableCell>

        {/* 메뉴 타입 */}
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getMenuTypeIcon(item.type)}
            <Typography variant="body2">
              {menuTypeChoices.find(choice => choice.id === item.type)?.name || item.type}
            </Typography>
          </Box>
        </TableCell>

        {/* 설명 */}
        <TableCell>
          <Typography variant="body2" sx={{ maxWidth: 200 }}>
            {item.description || '-'}
          </Typography>
        </TableCell>

        {/* 순서 */}
        <TableCell align="center">
          <Typography variant="body2">
            {item.displayOrder ?? 0}
          </Typography>
        </TableCell>

        {/* 접근 권한 */}
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {item.isPublic ? (
              <Tooltip title="공개">
                <Public fontSize="small" color="success" />
              </Tooltip>
            ) : (
              <Tooltip title="제한">
                <Lock fontSize="small" color="warning" />
              </Tooltip>
            )}
            {item.requireLogin && (
              <Tooltip title="로그인 필요">
                <Login fontSize="small" color="info" />
              </Tooltip>
            )}
          </Box>
        </TableCell>

        {/* 생성일 */}
        <TableCell>
          <Typography variant="body2">
            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}
          </Typography>
        </TableCell>

        {/* 액션 */}
        <TableCell>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="보기">
              <IconButton size="small" onClick={() => onShow(item.id)}>
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="편집">
              <IconButton size="small" onClick={() => onEdit(item.id)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="삭제">
              <IconButton size="small" color="error" onClick={() => onDelete(item)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* 하위 메뉴들 */}
      {hasChildren && (
        <TableRow>
          <TableCell colSpan={8} sx={{ p: 0, border: 'none' }}>
            <Collapse in={isExpanded} timeout="auto" unmountOnExit>
              {item.children.map((child: any) => (
                <MenuItem
                  key={child.id}
                  item={child}
                  level={level + 1}
                  expanded={expanded}
                  onToggleExpand={onToggleExpand}
                  onEdit={onEdit}
                  onShow={onShow}
                  onDelete={onDelete}
                />
              ))}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

// 계층적 테이블 컴포넌트
const HierarchicalTable = () => {
  const { data } = useListContext();
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: any }>({
    open: false,
    item: null,
  });
  
  const notify = useNotify();
  const refresh = useRefresh();
  const [deleteOne] = useDelete();

  // 계층적 구조로 데이터 변환
  const buildHierarchy = (items: any[]) => {
    const itemMap = new Map();
    const rootItems: any[] = [];

    // 모든 아이템을 맵에 저장
    items.forEach(item => {
      itemMap.set(item.id, { ...item, children: [] });
    });

    // 부모-자식 관계 설정
    items.forEach(item => {
      const mappedItem = itemMap.get(item.id);
      if (item.parentUUID && itemMap.has(item.parentUUID)) {
        const parent = itemMap.get(item.parentUUID);
        parent.children.push(mappedItem);
      } else {
        rootItems.push(mappedItem);
      }
    });

    // 각 그룹과 레벨별로 정렬
    const sortItems = (items: any[]) => {
      return items
        .sort((a, b) => {
          // 먼저 그룹키로 정렬
          if (a.groupKey !== b.groupKey) {
            return a.groupKey.localeCompare(b.groupKey);
          }
          // 그 다음 displayOrder로 정렬
          return (a.displayOrder || 0) - (b.displayOrder || 0);
        })
        .map(item => ({
          ...item,
          children: sortItems(item.children)
        }));
    };

    return sortItems(rootItems);
  };

  const hierarchicalData = buildHierarchy(data || []);

  const handleToggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleEdit = (id: string) => {
    window.location.href = `#/privates/siteMenu/${id}`;
  };

  const handleShow = (id: string) => {
    window.location.href = `#/privates/siteMenu/${id}/show`;
  };

  const handleDelete = (item: any) => {
    setDeleteDialog({ open: true, item });
  };

  const confirmDelete = () => {
    const { item } = deleteDialog;
    deleteOne(
      'privates/siteMenu',
      { id: item.id },
      {
        onSuccess: () => {
          notify('메뉴가 삭제되었습니다', { type: 'info' });
          refresh();
        },
        onError: (error: any) => {
          notify(`오류: ${error?.message || '삭제 중 오류가 발생했습니다'}`, { type: 'error' });
        },
      }
    );
    setDeleteDialog({ open: false, item: null });
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, minWidth: 250 }}>메뉴명</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>그룹</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>유형</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>설명</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">순서</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>권한</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>생성일</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>액션</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {hierarchicalData.map(item => (
              <MenuItem
                key={item.id}
                item={item}
                level={0}
                expanded={expanded}
                onToggleExpand={handleToggleExpand}
                onEdit={handleEdit}
                onShow={handleShow}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog 
        open={deleteDialog.open} 
        onClose={() => setDeleteDialog({ open: false, item: null })}
      >
        <DialogTitle>메뉴 삭제</DialogTitle>
        <DialogContent>
          <Typography>
            '{deleteDialog.item?.title}' 메뉴를 삭제하시겠습니까?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            하위 메뉴가 있는 경우 함께 삭제됩니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, item: null })}>
            취소
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            삭제
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// 메인 계층적 메뉴 목록 컴포넌트
export const SiteMenuHierarchicalList = () => {
  return (
    <List
      filters={siteMenuFilters}
      actions={<ListActions />}
      empty={
        <EmptyList
          title="등록된 메뉴가 없습니다"
          description="첫 번째 메뉴를 추가해보세요"
          icon={<MenuIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
          createButtonLabel="메뉴 추가"
        />
      }
      sort={{ field: 'groupKey,displayOrder', order: 'ASC' }}
      perPage={100}
      title="메뉴 관리 (계층형)"
    >
      <HierarchicalTable />
    </List>
  );
};

export default SiteMenuHierarchicalList;
