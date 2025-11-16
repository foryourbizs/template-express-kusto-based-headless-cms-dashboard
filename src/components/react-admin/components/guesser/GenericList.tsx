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
}: GenericListProps) => {
  
  // 기본 List 스타일
  const defaultListSx: SxProps<Theme> = {
    '& .RaList-actions': {
      alignItems: 'center',
    },
    '& .RaFilterForm-root': {
      alignItems: filterLayout === 'horizontal' ? 'center' : 'flex-start',
      flexDirection: filterLayout === 'horizontal' ? 'row' : 'column',
      flexWrap: filterLayout === 'horizontal' ? 'wrap' : 'nowrap',
      gap: filterLayout === 'horizontal' ? 1 : 2,
    },
    '& .MuiFormControl-root': {
      marginTop: 0,
      marginBottom: 0,
    },
    '& .ra-input': {
      borderRadius: 0,
    },
    '& .RaFilterFormInput-hideButton': {
      marginBottom: filterLayout === 'horizontal' ? '0px' : '0px',
      borderRadius: 1,
      border: '1px solid #ffffff',
      opacity: 0.5,
      padding: '6px',
      marginLeft: filterLayout === 'horizontal' ? '6px' : '2px',
      
    },
    ...listSx,
  };

  // 기본 Datagrid 스타일
  const defaultDatagridSx: SxProps<Theme> = {
    '& .RaDatagrid-headerCell': {
      fontWeight: 700 as any,
      backgroundColor: 'action.hover' as any,
      ...(headerCellSx as any),
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
