import React from 'react';
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
  [key: string]: any;
}

// 삭제 기능이 제거된 ListGuesser 컴포넌트
const ListGuesser: React.FC<ListGuesserProps> = ({ 
  children, 
  filters, 
  hasEdit = false, 
  hasShow = false, 
  hasCreate = false,
  ...props 
}) => {
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
