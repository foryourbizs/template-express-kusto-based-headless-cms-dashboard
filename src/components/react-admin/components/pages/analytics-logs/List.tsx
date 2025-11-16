"use client";

import { TextField, DateField, NumberField } from 'react-admin';
import { GenericList } from '../../guesser/GenericList';

export const AnalyticsLogsList = () => {
  return (
    <GenericList
      queryOptions={{

      }}
      columns={[
        <TextField key="id" source="id" label="ID" />,
        <TextField key="fingerprint" source="visitorFingerprint" label="핑거프린트" />,
        <TextField key="type" source="type" label="타입" />,
        <DateField key="timestamp" source="timestamp" label="발생 시간" />,
      ]}
      defaultSort={{ field: 'timestamp', order: 'DESC' }}
      rowClick="show"
      actions={false}
      perPage={50}
    />
  );
};
