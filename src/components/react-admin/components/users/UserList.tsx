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
} from "react-admin";

const UserListActions = () => (
  <TopToolbar>
    <RefreshButton />
    <ExportButton />
  </TopToolbar>
);

export const UserList = () => (
  <List actions={<UserListActions />}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="username" label="사용자명" />
      <EmailField source="email" label="이메일" />
      <DateField source="created_at" label="생성일" />
      <DateField source="updated_at" label="수정일" />
      <BooleanField source="is_active" label="활성 상태" />
    </Datagrid>
  </List>
);
