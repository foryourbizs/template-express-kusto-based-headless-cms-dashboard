"use client";

import { TextField, DateField, NumberField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const AnalyticsVisitorList = () => {
  return (
    <GenericList
      queryOptions={{

      }}
      columns={[
        <TextField key="id" source="id" label="ID" />,
        <TextField key="fingerprint" source="fingerprint" label="핑거프린트" />,

        <TextField key="ipaddress" source="ipAddress" label="아이피 주소" />,
        <TextField key="firstvisitat" source="firstVisitAt" label="첫 방문일" />,
      ]}
      defaultSort={{ field: 'firstvisitat', order: 'DESC' }}
      rowClick="show"
      actions={false}
      perPage={50}
    />
  );
};
