import React, { useEffect, useState } from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EmailField,
  NumberField,
  BooleanField,
  EditButton,
  ShowButton,
  DeleteButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  RefreshButton,
  BulkDeleteButton,
  BulkExportButton,
  useListContext,
  FunctionField,
  TextInput,
  useDataProvider,
  useNotify,
  Loading,
} from 'react-admin';

// 삭제 기능이 제거된 커스텀 액션 컴포넌트
const ListActionsWithoutDelete = ({ hasFilters, hasCreate }: { hasFilters: boolean; hasCreate: boolean }) => (
  <TopToolbar>
    {hasFilters && <FilterButton />}
    <RefreshButton />
    {hasCreate && <CreateButton />}
    <ExportButton />
  </TopToolbar>
);

// 조건부 벌크 액션 버튼 컴포넌트
const BulkActionButtons = ({ hasBulkDelete = false }: { hasBulkDelete?: boolean }) => {
  if (!hasBulkDelete) {
    return false; // 벌크 액션 완전히 제거
  }
  
  return (
    <>
      <BulkExportButton />
      <BulkDeleteButton />
    </>
  );
};

// 조건부 행 액션 컴포넌트 (Edit, Show, Delete 설정에 따라 버튼 표시)
const RowActions = ({ hasEdit = false, hasShow = false, hasDelete = false }: { hasEdit?: boolean; hasShow?: boolean; hasDelete?: boolean }) => {
  // 아무 액션도 없으면 아무것도 렌더링하지 않음
  if (!hasEdit && !hasShow && !hasDelete) {
    return null;
  }
  
  return (
    <>
      {hasEdit && <EditButton />}
      {hasShow && <ShowButton />}
      {hasDelete && <DeleteButton />}
    </>
  );
};

// 데이터를 기반으로 필드를 자동으로 추측하는 함수
const guessFields = (records: any[]) => {
  if (!records || records.length === 0) return [];

  const firstRecord = records[0];
  const fields = [];

  for (const [key, value] of Object.entries(firstRecord)) {
    if (key === 'id') {
      fields.push(<TextField key={key} source={key} />);
    } else if (typeof value === 'string') {
      if (value.includes('@')) {
        fields.push(<EmailField key={key} source={key} />);
      } else if (Date.parse(value)) {
        fields.push(<DateField key={key} source={key} />);
      } else {
        fields.push(<TextField key={key} source={key} />);
      }
    } else if (typeof value === 'number') {
      fields.push(<NumberField key={key} source={key} />);
    } else if (typeof value === 'boolean') {
      fields.push(<BooleanField key={key} source={key} />);
    } else if (value instanceof Date) {
      fields.push(<DateField key={key} source={key} />);
    } else {
      fields.push(<FunctionField key={key} source={key} render={(record: any) => String(record[key])} />);
    }
  }

  return fields;
};

// 조건부 Datagrid 컴포넌트 (삭제 기능 옵션 포함)
const ConditionalDatagrid: React.FC<{ 
  children?: React.ReactNode; 
  hasEdit?: boolean; 
  hasShow?: boolean; 
  hasDelete?: boolean;
  hasBulkDelete?: boolean;
}> = ({ children, hasEdit = false, hasShow = false, hasDelete = false, hasBulkDelete = false }) => {
  const { data } = useListContext();
  
  if (children) {
    return (
      <Datagrid
        bulkActionButtons={<BulkActionButtons hasBulkDelete={hasBulkDelete} />}
      >
        {children}
        <RowActions hasEdit={hasEdit} hasShow={hasShow} hasDelete={hasDelete} />
      </Datagrid>
    );
  }

  const fields = guessFields(data || []);
  
  return (
    <Datagrid
      bulkActionButtons={<BulkActionButtons hasBulkDelete={hasBulkDelete} />}
    >
      {fields}
      <RowActions hasEdit={hasEdit} hasShow={hasShow} hasDelete={hasDelete} />
    </Datagrid>
  );
};

interface ListGuesserProps {
  resource?: string;
  children?: React.ReactNode;
  filters?: React.ReactElement[];
  hasEdit?: boolean;       // Edit 버튼 표시 여부
  hasShow?: boolean;       // Show 버튼 표시 여부
  hasDelete?: boolean;     // Delete 버튼 표시 여부 (기본값: false)
  hasCreate?: boolean;     // Create 버튼 표시 여부
  hasBulkDelete?: boolean; // Bulk Delete 버튼 표시 여부 (기본값: false)
  checkPermissions?: boolean;  // 권한 체크 여부 (기본값: permissions 포함 리소스는 자동 활성화)
  [key: string]: any;
}

// 권한 체크 훅
const usePermissionCheck = (resource: string, enabled: boolean = true) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const dataProvider = useDataProvider();
  const notify = useNotify();

  useEffect(() => {
    if (!enabled) {
      setHasPermission(true);
      return;
    }

    const checkPermission = async () => {
      try {
        // 권한 리소스가 아닌 경우 바로 허용
        if (!resource.includes('permissions')) {
          setHasPermission(true);
          return;
        }

        // permissions 리소스인 경우 실제 데이터 확인
        const response = await dataProvider.getList(resource, {
          pagination: { page: 1, perPage: 1 },
          sort: { field: 'id', order: 'ASC' },
          filter: {},
        });

        // 데이터가 있으면 권한 있음, 없으면 권한 없음
        setHasPermission(response.data && response.data.length > 0);
      } catch (error: any) {
        console.warn(`Permission check failed for ${resource}:`, error);
        // 403, 401 에러인 경우 권한 없음으로 처리
        if (error.status === 403 || error.status === 401) {
          setHasPermission(false);
        } else {
          // 네트워크 오류 등 다른 에러는 허용
          setHasPermission(true);
        }
      }
    };

    checkPermission();
  }, [resource, enabled, dataProvider]);

  return hasPermission;
};

// 조건부 삭제 기능을 포함한 ListGuesser 컴포넌트
const ListGuesser: React.FC<ListGuesserProps> = ({ 
  children, 
  filters, 
  hasEdit = false, 
  hasShow = false, 
  hasDelete = false,
  hasCreate = false,
  hasBulkDelete = false,
  checkPermissions,
  resource,
  ...props 
}) => {
  // permissions가 포함된 리소스는 자동으로 권한 체크 활성화
  const shouldCheckPermissions = checkPermissions ?? (resource?.includes('permissions') || false);
  const hasPermission = usePermissionCheck(resource || '', shouldCheckPermissions);

  // 권한 체크가 활성화되어 있고 아직 체크 중인 경우
  if (shouldCheckPermissions && hasPermission === null) {
    return <Loading />;
  }

  // 권한 체크가 활성화되어 있고 권한이 없는 경우
  if (shouldCheckPermissions && hasPermission === false) {
    return null; // 아무것도 렌더링하지 않음
  }

  // 기본 검색 필터 (filters가 제공되지 않은 경우)
  const defaultFilters = filters || [
    <TextInput
      key="search"
      label="검색"
      source="q"
      placeholder="검색어를 입력하세요..."
    />
  ];

  const hasFilters = defaultFilters && defaultFilters.length > 0;

  return (
    <List 
      resource={resource}
      actions={<ListActionsWithoutDelete hasFilters={hasFilters} hasCreate={hasCreate} />} 
      filters={hasFilters ? defaultFilters : undefined}
      {...props}
    >
      <ConditionalDatagrid 
        hasEdit={hasEdit} 
        hasShow={hasShow} 
        hasDelete={hasDelete}
        hasBulkDelete={hasBulkDelete}
      >
        {children}
      </ConditionalDatagrid>
    </List>
  );
};

export default ListGuesser;
