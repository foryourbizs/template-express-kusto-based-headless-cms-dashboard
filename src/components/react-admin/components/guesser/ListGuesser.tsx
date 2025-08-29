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
  useResourceContext,
  useListContext,
  FunctionField,
  TextInput,
  Filter,
} from 'react-admin';
import { TableHead, TableRow, TableCell } from '@mui/material';

// 기본 필터 정의 (공통으로 사용할 수 있는 필터들)
const getDefaultFilters = (data: any[]) => {
  if (!data || data.length === 0) return [];

  const firstRecord = data[0];
  const filters = [];

  for (const [key, value] of Object.entries(firstRecord)) {
    if (key === 'id') continue; // ID는 필터에서 제외
    
    if (typeof value === 'string') {
      if (value.includes('@')) {
        // 이메일 필드
        filters.push(
          <TextInput
            key={key}
            label={key}
            source={key}
            placeholder={`${key} 검색...`}
          />
        );
      } else {
        // 일반 텍스트 필드
        filters.push(
          <TextInput
            key={key}
            label={key}
            source={key}
            placeholder={`${key} 검색...`}
          />
        );
      }
    }
  }

  return filters;
};

// 삭제 기능이 제거된 커스텀 액션 컴포넌트
const ListActionsWithoutDelete = ({ hasFilters }: { hasFilters: boolean }) => (
  <TopToolbar>
    {hasFilters && <FilterButton />}
    <RefreshButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

// 삭제 기능이 제거된 커스텀 행 액션 컴포넌트
const RowActionsWithoutDelete = () => (
  <>
    <EditButton />
    <ShowButton />
  </>
);

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

// 삭제 기능이 제거된 Datagrid 컴포넌트
const DatagridWithoutDelete: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { data } = useListContext();
  
  if (children) {
    return (
      <Datagrid>
        {children}
        <RowActionsWithoutDelete />
      </Datagrid>
    );
  }

  const fields = guessFields(data || []);
  
  return (
    <Datagrid>
      {fields}
      <RowActionsWithoutDelete />
    </Datagrid>
  );
};

// 필터를 동적으로 생성하는 내부 컴포넌트
const ListGuesserContent: React.FC<{ children?: React.ReactNode; customFilters?: React.ReactElement[] }> = ({ children, customFilters }) => {
  const { data } = useListContext();
  
  // 커스텀 필터가 없고 데이터가 있으면 자동으로 필터 생성
  const defaultFilters = customFilters || (data && data.length > 0 ? getDefaultFilters(data) : []);
  const hasFilters = defaultFilters && defaultFilters.length > 0;

  // TopToolbar 컴포넌트 동적 생성
  const ListActions = () => (
    <TopToolbar>
      {hasFilters && <FilterButton />}
      <RefreshButton />
      <CreateButton />
      <ExportButton />
    </TopToolbar>
  );

  return (
    <>
      <DatagridWithoutDelete>
        {children}
      </DatagridWithoutDelete>
    </>
  );
};

interface ListGuesserProps {
  resource?: string;
  children?: React.ReactNode;
  filters?: React.ReactElement[];
  [key: string]: any;
}

// 삭제 기능이 제거된 ListGuesser 컴포넌트
const ListGuesser: React.FC<ListGuesserProps> = ({ children, filters, ...props }) => {
  // 미리 정의된 기본 필터들 (데이터가 없어도 사용 가능)
  const fallbackFilters = [
    <TextInput
      key="search"
      label="검색"
      source="q"
      placeholder="검색어를 입력하세요..."
    />
  ];

  const finalFilters = filters || fallbackFilters;
  const hasFilters = finalFilters && finalFilters.length > 0;

  return (
    <List 
      actions={<ListActionsWithoutDelete hasFilters={hasFilters} />} 
      filters={hasFilters ? finalFilters : undefined}
      {...props}
    >
      <DatagridWithoutDelete>
        {children}
      </DatagridWithoutDelete>
    </List>
  );
};

export default ListGuesser;
