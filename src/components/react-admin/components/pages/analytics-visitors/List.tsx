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
        <DateField key="firstVisitAt" source="firstVisitAt" label="첫 방문일" showTime />,
      ]}
      defaultSort={{ field: 'firstVisitAt', order: 'DESC' }}
      rowClick="show"
      actions={false}
      perPage={50}
    />
  );
};
