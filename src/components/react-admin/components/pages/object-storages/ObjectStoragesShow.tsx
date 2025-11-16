"use client";

import { GenericShow, ShowSection } from '../../guesser/GenericShow';
import {
  InfoOutlined,
  StorageOutlined,
  SecurityOutlined,
  SettingsOutlined,
  HistoryOutlined,
} from '@mui/icons-material';
import { Chip, Typography } from '@mui/material';

export const ObjectStoragesShow = () => {
  const sections: ShowSection[] = [
    {
      title: '기본 정보',
      icon: <InfoOutlined />,
      columns: 2,
      fields: [
        { source: 'id', label: 'ID', type: 'text' },
        { source: 'uuid', label: 'UUID', type: 'text' },
        { source: 'name', label: '저장소명', type: 'text' },
        { source: 'provider', label: '제공업체', type: 'custom', render: (value) => (
          <Chip label={value?.toUpperCase()} size="small" color="primary" variant="outlined" />
        )},
        { source: 'description', label: '설명', type: 'text' },
        {
          source: 'isDefault',
          label: '기본 저장소',
          type: 'custom',
          render: (value) => (
            <Chip
              label={value ? '기본' : '일반'}
              color={value ? 'success' : 'default'}
              size="small"
            />
          )
        },
        {
          source: 'isActive',
          label: '활성 상태',
          type: 'custom',
          render: (value) => (
            <Chip
              label={value ? '활성' : '비활성'}
              color={value ? 'success' : 'error'}
              size="small"
            />
          )
        },
      ],
    },
    {
      title: '연결 정보',
      icon: <StorageOutlined />,
      columns: 2,
      fields: [
        { source: 'baseUrl', label: 'Base URL', type: 'text' },
        { source: 'bucketName', label: '버킷명', type: 'text' },
        { source: 'region', label: '리전', type: 'text' },
      ],
    },
    {
      title: '인증 정보',
      icon: <SecurityOutlined />,
      columns: 2,
      fields: [
        {
          source: 'accessKey',
          label: 'Access Key',
          type: 'custom',
          render: (value) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {value ? '••••••••' + value.slice(-4) : '-'}
            </Typography>
          )
        },
        {
          source: 'secretKey',
          label: 'Secret Key',
          type: 'custom',
          render: (value) => (
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
              {value ? '••••••••••••••••' : '-'}
            </Typography>
          )
        },
      ],
    },
    {
      title: '메타데이터',
      icon: <SettingsOutlined />,
      columns: 1,
      fields: [
        { source: 'metadata', label: '추가 설정 정보', type: 'json' },
      ],
    },
    {
      title: '감사 추적',
      icon: <HistoryOutlined />,
      columns: 2,
      fields: [
        { source: 'createdAt', label: '생성일시', type: 'date' },
        { source: 'updatedAt', label: '수정일시', type: 'date' },
        { source: 'deletedAt', label: '삭제일시', type: 'date' },
      ],
    },
  ];

  return (
    <GenericShow
      sections={sections}
      enableEdit={true}
      enableDelete={true}
      useTabs={true}
      queryOptions={{
        meta: {
          include: ['files']
        }
      }}
    />
  );
};
