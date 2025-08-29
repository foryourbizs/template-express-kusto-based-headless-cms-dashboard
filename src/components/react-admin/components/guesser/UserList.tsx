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
} from "react-admin";

const UserListActions = () => (
  <TopToolbar>
    <FilterButton />
    <RefreshButton />
    <ExportButton />
  </TopToolbar>
);


const UserFilter = [
    <TextInput label="사용자명" source="username" />,
    <TextInput label="이메일" source="email" defaultValue="" />,
    <BooleanInput label="활성여부" source="isActive" />,
    <BooleanInput label="인증됨" source="isVerified" />,
    <BooleanInput label="정지됨" source="isSuspended" />
  ];


export const UserList = () => (
  <List actions={<UserListActions />} filters={UserFilter}>
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
