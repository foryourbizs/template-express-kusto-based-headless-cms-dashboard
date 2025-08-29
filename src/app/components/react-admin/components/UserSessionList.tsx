'use client';

import { 
  List, 
  Datagrid, 
  TextField, 
  BooleanField, 
  DateField, 
  NumberField 
} from 'react-admin';

export const UserSessionList = () => (
  <List>
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
