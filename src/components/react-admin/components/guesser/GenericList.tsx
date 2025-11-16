"use client";

import { 
  List, 
  Datagrid,
  DatagridProps,
  ListProps,
  FilterProps,
  SortPayload,
} from 'react-admin';
import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme } from '@mui/material';

/**
 * GenericList Props 인터페이스
 * 
 * @example
 * ```tsx
 * <GenericList
 *   resource="privates/users"
 *   columns={[
 *     <TextField source="username" label="사용자명" />,
 *     <EmailField source="email" label="이메일" />
 *   ]}
 *   filters={userFilters}
 *   defaultSort={{ field: 'createdAt', order: 'DESC' }}
 * />
 * ```
 */
export interface GenericListProps {
  /** 
   * 리소스 이름 (필수)
   * @example "privates/users", "privates/files"
   */
  resource?: string;

  /**
   * Datagrid에 표시될 컬럼 배열 (필수)
   * React Admin의 Field 컴포넌트들을 배열로 전달
   * @example [<TextField source="id" />, <EmailField source="email" />]
   */
  columns: ReactElement[];

  /**
   * 필터 컴포넌트 배열
   * @example [<TextInput source="q" />, <SelectInput source="status" />]
   */
  filters?: ReactElement[];

  /**
   * 필터 기본값
   * @example { status: 'active', isVerified: true }
   */
  filterDefaultValues?: Record<string, any>;

  /**
   * 기본 정렬 설정
   * @example { field: 'createdAt', order: 'DESC' }
   */
  defaultSort?: SortPayload;

  /**
   * 페이지당 항목 수
   * @default 25
   */
  perPage?: number;

  /**
   * 행 클릭 동작
   * @default "show"
   * @example "edit" | "show" | false | (id, resource, record) => string
   */
  rowClick?: DatagridProps['rowClick'];

  /**
   * 대량 작업 버튼 활성화 여부
   * @default false
   */
  enableBulkActions?: boolean;

  /**
   * 커스텀 대량 작업 버튼
   * @example <BulkDeleteButton />
   */
  bulkActionButtons?: ReactElement | false;

  /**
   * Datagrid 추가 Props
   * @example { optimized: true, isRowSelectable: () => true }
   */
  datagridProps?: Partial<DatagridProps>;

  /**
   * List 추가 Props
   * @example { empty: <CustomEmpty />, actions: <CustomActions /> }
   */
  listProps?: Partial<Omit<ListProps, 'children'>>;

  /**
   * List 컨테이너 커스텀 스타일
   */
  listSx?: SxProps<Theme>;

  /**
   * Datagrid 커스텀 스타일
   */
  datagridSx?: SxProps<Theme>;

  /**
   * 헤더 셀 스타일 커스터마이징
   * @default { fontWeight: 700, backgroundColor: 'action.hover' }
   */
  headerCellSx?: SxProps<Theme>;

  /**
   * 필터 폼 정렬 방식
   * @default 'horizontal' - 가로 정렬
   * @example 'vertical' - 세로 정렬
   */
  filterLayout?: 'horizontal' | 'vertical';

  /**
   * 빈 상태 커스텀 컴포넌트
   */
  empty?: ReactElement | false;

  /**
   * 커스텀 액션 버튼 영역
   */
  actions?: ReactElement | false;

  /**
   * 페이지네이션 위치
   * @default 'bottom'
   * @example 'top' | 'both'
   */
  paginationPosition?: 'top' | 'bottom' | 'both';

  /**
   * 제목 표시 여부
   * @default true
   */
  hasTitle?: boolean;

  /**
   * 커스텀 제목
   */
  title?: string | ReactElement;

  /**
   * storeKey - 필터/정렬 상태 저장 키
   * false로 설정시 상태 저장 안함
   * @default resource 이름
   */
  storeKey?: string | false;

  /**
   * 필터를 항상 표시할지 여부
   * @default false
   */
  alwaysShowFilters?: boolean;

  /**
   * 내보내기 기능 비활성화
   * @default false
   */
  disableExport?: boolean;

  /**
   * 검색 필터 자동 포커스
   * @default false
   */
  autoFocusFilter?: boolean;

  /**
   * 쿼리 옵션 (includes, meta 등)
   * @example { meta: { include: ['users', 'roles'] } }
   */
  queryOptions?: {
    meta?: {
      include?: string[];
      [key: string]: any;
    };
    [key: string]: any;
  };
}

/**
 * GenericList - 재사용 가능한 범용 리스트 컴포넌트
 * 
 * React Admin의 List + Datagrid를 래핑하여 
 * 설정 기반으로 쉽게 리스트 페이지를 구성할 수 있습니다.
 * 
 * @example 기본 사용법
 * ```tsx
 * import { GenericList } from '@/components/react-admin/components/guesser/GenericList';
 * 
 * export const UsersList = () => (
 *   <GenericList
 *     columns={[
 *       <TextField source="id" label="ID" />,
 *       <TextField source="username" label="사용자명" />,
 *       <EmailField source="email" label="이메일" />,
 *     ]}
 *     filters={[
 *       <TextInput source="q" label="검색" alwaysOn />,
 *       <SelectInput source="status" choices={statusChoices} />
 *     ]}
 *     defaultSort={{ field: 'createdAt', order: 'DESC' }}
 *     filterDefaultValues={{ status: 'active' }}
 *   />
 * );
 * ```
 * 
 * @example 고급 커스터마이징
 * ```tsx
 * <GenericList
 *   columns={columns}
 *   filters={filters}
 *   rowClick="edit"
 *   enableBulkActions={true}
 *   bulkActionButtons={<><BulkDeleteButton /><BulkExportButton /></>}
 *   datagridProps={{ 
 *     optimized: true,
 *     isRowSelectable: record => record.canDelete 
 *   }}
 *   listProps={{
 *     empty: <CustomEmpty />,
 *     actions: <CustomActions />
 *   }}
 *   datagridSx={{
 *     '& .RaDatagrid-rowCell': { 
 *       borderBottom: '2px solid #eee' 
 *     }
 *   }}
 * />
 * ```
 */
export const GenericList = ({
  columns,
  filters = [],
  filterDefaultValues = {},
  defaultSort = { field: 'id', order: 'DESC' as const },
  perPage = 25,
  rowClick = 'show',
  enableBulkActions = false,
  bulkActionButtons,
  datagridProps = {},
  listProps = {},
  listSx,
  datagridSx,
  headerCellSx,
  filterLayout = 'horizontal',
  empty,
  actions,
  paginationPosition = 'bottom',
  hasTitle = true,
  title,
  storeKey,
  alwaysShowFilters = false,
  disableExport = false,
  autoFocusFilter = false,
  queryOptions,
}: GenericListProps) => {
  
  // 기본 List 스타일
  const defaultListSx: SxProps<Theme> = {
    // List 컨테이너 여백
    '& .RaList-main': {
      padding: { xs: 0, sm: 0 },
      margin: { xs: 0, sm: 0 },
      overflowX: 'hidden',
    },
    '& .RaList-content': {
      padding: { xs: 0, sm: 0 },
      boxShadow: { xs: 'none', sm: 'inherit' },
      borderRadius: { xs: 0, sm: 1 },
      backgroundColor: { xs: 'transparent', sm: 'background.paper' },
      overflowX: 'hidden',
    },
    '& .RaList-actions': {
      alignItems: 'start',
      mb: 1.5,
      padding: { xs: '0 12px', sm: 0 },
    },
    '& .RaList-toolbar': {
      padding: { xs: '8px 12px', sm: '8px 16px' },
      minHeight: { xs: '48px', sm: '56px' },
    },
    '& .RaPagination-toolbar': {
      padding: { xs: '8px 12px', sm: '8px 16px' },
      minHeight: { xs: '48px', sm: '56px' },
    },
    '& .RaFilterForm-root': {
      display: 'flex',
      alignItems: 'stretch',
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: filterLayout === 'horizontal' ? 1 : 2,
      backgroundColor: filterLayout === 'horizontal' ? 'background.paper' : 'transparent',
      padding: filterLayout === 'horizontal' ? { xs: 1.5, sm: 2 } : 0,
      borderRadius: filterLayout === 'horizontal' ? 1.5 : 0,
      border: filterLayout === 'horizontal' ? '1px solid' : 'none',
      borderColor: filterLayout === 'horizontal' ? 'divider' : 'transparent',
      boxShadow: filterLayout === 'horizontal' ? '0 1px 8px rgba(0,0,0,0.05)' : 'none',
      mb: filterLayout === 'horizontal' ? 2 : 0,
    },
    '& .RaFilterFormInput-body': {
      display: 'flex',
      alignItems: 'stretch',
      gap: filterLayout === 'horizontal' ? 0.75 : 0.5,
      flex: filterLayout === 'horizontal' ? { xs: '1 1 100%', sm: '0 1 auto' } : 'none',
      minWidth: filterLayout === 'horizontal' ? { xs: '100%', sm: '180px' } : 'auto',
      height: '100%',
    },
    '& .MuiFormControl-root': {
      marginTop: '0 !important',
      marginBottom: '0 !important',
      flex: 1,
      minWidth: 0,
      display: 'flex',
    },
    '& .MuiInputBase-root': {
      backgroundColor: filterLayout === 'horizontal' ? 'action.hover' : 'background.paper',
      borderRadius: filterLayout === 'horizontal' ? 1.5 : 1,
      transition: 'all 0.2s ease-in-out',
      height: filterLayout === 'horizontal' ? { xs: '38px', sm: '42px' } : 'auto',
      '&:hover': {
        backgroundColor: filterLayout === 'horizontal' ? 'action.selected' : 'action.hover',
        boxShadow: filterLayout === 'horizontal' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
      },
      '&.Mui-focused': {
        backgroundColor: 'background.paper',
        boxShadow: filterLayout === 'horizontal' ? '0 0 0 2px rgba(25, 118, 210, 0.2)' : 'none',
      },
    },
    '& .MuiInputBase-input': {
      padding: filterLayout === 'horizontal' ? { xs: '8px 12px', sm: '10px 14px' } : '16.5px 14px',
      fontSize: filterLayout === 'horizontal' ? '0.875rem' : '1rem',
      height: 'auto',
    },
    '& .MuiInputLabel-root': {
      fontWeight: filterLayout === 'horizontal' ? 500 : 400,
      fontSize: filterLayout === 'horizontal' ? '0.875rem' : '1rem',
    },
    '& .ra-input': {
      borderRadius: 0,
    },
    '& .RaFilterFormInput-hideButton': {
      margin: '0 !important',
      padding: '0 !important',
      borderRadius: 1.5,
      border: '1px solid',
      borderColor: filterLayout === 'horizontal' ? 'divider' : 'action.disabled',
      opacity: filterLayout === 'horizontal' ? 0.7 : 0.5,
      transition: 'all 0.2s ease-in-out',
      backgroundColor: filterLayout === 'horizontal' ? 'background.paper' : 'transparent',
      flexShrink: 0,
      display: 'inline-flex !important',
      alignItems: 'center !important',
      justifyContent: 'center !important',
      alignSelf: 'stretch !important',
      minWidth: filterLayout === 'horizontal' ? { xs: '38px', sm: '42px' } : 'auto',
      width: filterLayout === 'horizontal' ? { xs: '38px', sm: '42px' } : 'auto',
      height: filterLayout === 'horizontal' ? { xs: '38px !important', sm: '42px !important' } : 'auto',
      '& .MuiSvgIcon-root': {
        fontSize: filterLayout === 'horizontal' ? { xs: '1.1rem', sm: '1.25rem' } : '1.5rem',
      },
      '&:hover': {
        opacity: 1,
        backgroundColor: filterLayout === 'horizontal' ? 'action.hover' : 'action.selected',
        borderColor: filterLayout === 'horizontal' ? 'primary.main' : 'action.disabled',
        transform: 'scale(1.05)',
      },
    },
    ...listSx,
  };

  // 기본 Datagrid 스타일
  const defaultDatagridSx: SxProps<Theme> = {
    // 반응형 테이블 래퍼 - 테이블만 가로 스크롤
    '& .RaDatagrid-tableWrapper': {
      overflowX: 'auto !important',
      overflowY: 'hidden',
      WebkitOverflowScrolling: 'touch',
      margin: { xs: 0, sm: 0 },
      padding: { xs: 0, sm: 0 },
      backgroundColor: { xs: 'background.paper', sm: 'transparent' },
      borderRadius: { xs: 0, sm: 0 },
      maxWidth: '100%',
      width: '100%',
      // 스크롤바 스타일링
      '&::-webkit-scrollbar': {
        height: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'action.hover',
        borderRadius: '4px',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'action.disabled',
        borderRadius: '4px',
        '&:hover': {
          backgroundColor: 'action.active',
        },
      },
    },
    // 테이블 자체
    '& table': {
      minWidth: { xs: '600px', sm: '100%', md: 'auto' },
      width: { xs: 'max-content', sm: '100%', md: 'auto' },
      tableLayout: 'auto',
      borderCollapse: 'separate',
      borderSpacing: '0',
    },
    // 헤더 셀
    '& .RaDatagrid-headerCell': {
      fontWeight: 700 as any,
      backgroundColor: { xs: 'grey.100', sm: 'action.hover' } as any,
      padding: { xs: '12px 8px', sm: '14px 12px', md: '16px' },
      fontSize: { xs: '0.75rem', sm: '0.813rem', md: '0.875rem' },
      whiteSpace: 'nowrap',
      borderBottom: { xs: '2px solid', sm: '1px solid' },
      borderColor: { xs: 'primary.main', sm: 'divider' },
      position: { xs: 'sticky', sm: 'sticky' },
      top: { xs: 0, sm: 0 },
      zIndex: { xs: 10, sm: 10 },
      lineHeight: 1.3,
      letterSpacing: { xs: '0.02em', sm: 'normal' },
      textTransform: { xs: 'none', sm: 'none' },
      ...(headerCellSx as any),
    },
    // 바디 셀
    '& .RaDatagrid-rowCell': {
      padding: { xs: '12px 8px', sm: '14px 12px', md: '16px' },
      fontSize: { xs: '0.8125rem', sm: '0.875rem', md: '0.875rem' },
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: { xs: '150px', sm: '250px', md: 'none' },
      lineHeight: 1.5,
      borderBottom: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'background.paper',
    },
    // 행 hover 효과
    '& .RaDatagrid-row': {
      transition: 'background-color 0.2s',
      '&:hover': {
        backgroundColor: { xs: 'action.hover', sm: 'action.selected' },
        '& .RaDatagrid-rowCell': {
          backgroundColor: { xs: 'action.hover', sm: 'action.selected' },
        },
      },
    },
    // 체크박스 컬럼 최소화
    '& .RaDatagrid-headerCell:first-of-type, & .RaDatagrid-rowCell:first-of-type': {
      padding: { xs: '8px 4px', sm: '8px 6px', md: '16px' },
      width: { xs: '40px', sm: '48px', md: 'auto' },
      minWidth: { xs: '40px', sm: '48px', md: 'auto' },
    },
    // 체크박스 크기 조정
    '& .MuiCheckbox-root': {
      padding: { xs: '6px', sm: '8px', md: '9px' },
      '& .MuiSvgIcon-root': {
        fontSize: { xs: '1.25rem', sm: '1.35rem', md: '1.5rem' },
      },
    },
    // 액션 버튼 컬럼
    '& .column-actions': {
      whiteSpace: 'nowrap',
      textAlign: 'right',
      padding: { xs: '8px 6px', sm: '12px 8px', md: '16px' },
      '& .MuiIconButton-root': {
        padding: { xs: '6px', sm: '7px', md: '8px' },
        '& .MuiSvgIcon-root': {
          fontSize: { xs: '1.15rem', sm: '1.2rem', md: '1.25rem' },
        },
      },
    },
    // 빈 상태
    '& .RaDatagrid-empty': {
      padding: { xs: 3, sm: 4, md: 5 },
      textAlign: 'center',
    },
    ...datagridSx,
  };

  // 대량 작업 버튼 처리
  const resolveBulkActionButtons = () => {
    if (bulkActionButtons !== undefined) {
      return bulkActionButtons;
    }
    return enableBulkActions ? undefined : false;
  };

  // List Props 병합
  const mergedListProps: Partial<ListProps> = {
    sort: defaultSort,
    perPage,
    filters: filters.length > 0 ? filters : undefined,
    filterDefaultValues: Object.keys(filterDefaultValues).length > 0 ? filterDefaultValues : undefined,
    sx: defaultListSx,
    empty,
    actions,
    title: hasTitle ? title : false,
    storeKey,
    disableSyncWithLocation: storeKey === false,
    exporter: disableExport ? false : undefined,
    queryOptions,
    ...listProps,
  };

  // Datagrid Props 병합
  const mergedDatagridProps: Partial<DatagridProps> = {
    rowClick,
    bulkActionButtons: resolveBulkActionButtons(),
    sx: defaultDatagridSx,
    ...datagridProps,
  };

  return (
    <List {...mergedListProps}>
      <Datagrid {...mergedDatagridProps}>
        {columns}
      </Datagrid>
    </List>
  );
};

export default GenericList;
