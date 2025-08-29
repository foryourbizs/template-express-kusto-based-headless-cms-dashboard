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
  useResourceContext,
  useListContext,
  FunctionField,
} from 'react-admin';
import { TableHead, TableRow, TableCell } from '@mui/material';

// 삭제 기능이 제거된 커스텀 액션 컴포넌트
const ListActionsWithoutDelete = () => (
  <TopToolbar>
    <FilterButton />
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

interface ListGuesserProps {
  resource?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

// 삭제 기능이 제거된 ListGuesser 컴포넌트
const ListGuesser: React.FC<ListGuesserProps> = ({ children, ...props }) => {
  return (
    <List actions={<ListActionsWithoutDelete />} {...props}>
      <DatagridWithoutDelete>
        {children}
      </DatagridWithoutDelete>
    </List>
  );
};

export default ListGuesser;
