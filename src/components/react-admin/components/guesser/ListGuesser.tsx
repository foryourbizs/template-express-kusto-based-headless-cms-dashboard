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
  TopToolbar,
  CreateButton,
  ExportButton,
  FilterButton,
  RefreshButton,
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

// 조건부 행 액션 컴포넌트 (Edit, Show 설정에 따라 버튼 표시)
const RowActionsWithoutDelete = ({ hasEdit = false, hasShow = false }: { hasEdit?: boolean; hasShow?: boolean }) => {
  // 둘 다 없으면 아무것도 렌더링하지 않음
  if (!hasEdit && !hasShow) {
    return null;
  }
  
  return (
    <>
      {hasEdit && <EditButton />}
      {hasShow && <ShowButton />}
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

// 조건부 Datagrid 컴포넌트 (벌크 삭제 기능 제거, 조건부 액션 버튼)
const DatagridWithoutDelete: React.FC<{ 
  children?: React.ReactNode; 
  hasEdit?: boolean; 
  hasShow?: boolean; 
}> = ({ children, hasEdit = false, hasShow = false }) => {
  const { data } = useListContext();
  
  if (children) {
    return (
      <Datagrid
        bulkActionButtons={false} // 벌크 액션 버튼 완전히 제거
      >
        {children}
        <RowActionsWithoutDelete hasEdit={hasEdit} hasShow={hasShow} />
      </Datagrid>
    );
  }

  const fields = guessFields(data || []);
  
  return (
    <Datagrid
      bulkActionButtons={false} // 벌크 액션 버튼 완전히 제거
    >
      {fields}
      <RowActionsWithoutDelete hasEdit={hasEdit} hasShow={hasShow} />
    </Datagrid>
  );
};

interface ListGuesserProps {
  resource?: string;
  children?: React.ReactNode;
  filters?: React.ReactElement[];
  hasEdit?: boolean;    // Edit 버튼 표시 여부
  hasShow?: boolean;    // Show 버튼 표시 여부
  hasCreate?: boolean;  // Create 버튼 표시 여부
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

// 삭제 기능이 제거된 ListGuesser 컴포넌트
const ListGuesser: React.FC<ListGuesserProps> = ({ 
  children, 
  filters, 
  hasEdit = false, 
  hasShow = false, 
  hasCreate = false,
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
      <DatagridWithoutDelete hasEdit={hasEdit} hasShow={hasShow}>
        {children}
      </DatagridWithoutDelete>
    </List>
  );
};

export default ListGuesser;
