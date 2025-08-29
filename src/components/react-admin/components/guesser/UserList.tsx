import {
  List,
  Datagrid,
  TextField,
  EmailField,
  DateField,
  NumberField,
  BooleanField,
  TopToolbar,
  ExportButton,
  RefreshButton,
  Filter,
  TextInput,
  BooleanInput,
  FilterButton,
  SelectInput,
} from "react-admin";

const UserListActions = () => (
  <TopToolbar>
    <FilterButton />
    <RefreshButton />
    <ExportButton />
  </TopToolbar>
);


const userFilters = [
  <TextInput 
    key="username"
    label="사용자명" 
    source="username" 
    placeholder="사용자명 검색..."  
  />,
  <TextInput 
    key="email"
    label="이메일" 
    source="email" 
    placeholder="이메일 검색..." 
  />,
  <TextInput 
    key="firstName"
    label="이름" 
    source="firstName" 
    placeholder="이름 검색..." 
  />,
  <TextInput 
    key="lastName"
    label="성" 
    source="lastName" 
    placeholder="성 검색..." 
  />,
  <SelectInput 
    key="isActive"
    label="활성 상태" 
    source="isActive" 
    choices={[
      { id: true, name: '활성' },
      { id: false, name: '비활성' },
    ]}
    emptyText="전체"
  />,
  <SelectInput 
    key="isVerified"
    label="인증 상태" 
    source="isVerified" 
    choices={[
      { id: true, name: '인증됨' },
      { id: false, name: '미인증' },
    ]}
    emptyText="전체"
  />,
  <SelectInput 
    key="isSuspended"
    label="정지 상태" 
    source="isSuspended" 
    choices={[
      { id: true, name: '정지됨' },
      { id: false, name: '정상' },
    ]}
    emptyText="전체"
  />
];


export const UserList = () => (
  <List actions={<UserListActions />} filters={userFilters}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="username" label="사용자명" />
      <TextField source="firstName" label="이름" />
      <TextField source="lastName" label="성" />
      <EmailField source="email" label="이메일" />
      <BooleanField source="isActive" label="활성" />
      <BooleanField source="isVerified" label="인증됨" />
      <BooleanField source="isSuspended" label="정지됨" />
      <DateField source="lastLoginAt" label="마지막 로그인" showTime />
      <DateField source="createdAt" label="생성일" showTime />
    </Datagrid>
  </List>
);
