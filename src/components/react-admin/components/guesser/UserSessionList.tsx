'use client';

import { 
  List, 
  Datagrid, 
  TextField, 
  BooleanField, 
  DateField, 
  NumberField 
} from 'react-admin';
import {
	Computer as ComputerIcon,
} from '@mui/icons-material';
import EmptyList from '../common/EmptyList';

export const UserSessionList = () => (
  <List
    empty={
      <EmptyList
        title="활성화된 세션이 없습니다"
        description="사용자가 로그인하면 세션 정보가 여기에 표시됩니다"
        icon={<ComputerIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        showCreateButton={false}
      />
    }
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="userUuid" />
      <TextField source="jti" />
      <TextField source="refreshJti" />
      <TextField source="familyId" />
      <NumberField source="generation" />
      <TextField source="deviceInfo" />
      <TextField source="deviceId" />
      <TextField source="ipAddress" />
      <TextField source="location" />
      <BooleanField source="isActive" />
      <BooleanField source="isCompromised" />
      <DateField source="lastUsedAt" />
      <DateField source="expiresAt" />
      <DateField source="accessTokenExpiresAt" />
      <DateField source="refreshTokenExpiresAt" />
      <TextField source="loginMethod" />
      <NumberField source="trustScore" />
      <TextField source="deletedAt" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);
