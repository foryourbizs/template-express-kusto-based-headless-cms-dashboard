"use client";

import { GenericShow, ShowSection } from '../../guesser/GenericShow';
import { 
  Category as CategoryIcon, 
  Link as LinkIcon, 
  Info as InfoIcon,
  DeleteOutline as DeleteIcon,
} from '@mui/icons-material';
import { Chip, Box, Typography } from '@mui/material';

/**
 * Term Show Component
 * 분류(Term) 상세보기 페이지
 */
export const TermShow = () => {
  // 섹션 정의
  const sections: ShowSection[] = [
    {
      title: '기본 정보',
      icon: <CategoryIcon />,
      columns: 2,
      fields: [
        {
          source: 'id',
          label: 'ID',
          type: 'text',
        },
        {
          source: 'name',
          label: '분류명',
          type: 'text',
        },
        {
          source: 'slug',
          label: 'URL 슬러그',
          type: 'custom',
          render: (value) => (
            <Box
              sx={{
                fontFamily: 'monospace',
                fontSize: '0.938rem',
                color: 'text.primary',
                backgroundColor: 'info.lighter',
                border: '1px solid',
                borderColor: 'info.light',
                padding: '8px 12px',
                borderRadius: 1.5,
                display: 'inline-block',
              }}
            >
              /{value}
            </Box>
          ),
        },
      ],
    },
    {
      title: '상태 정보',
      icon: <InfoIcon />,
      columns: 1,
      fields: [
        {
          source: 'deletedAt',
          label: '삭제 상태',
          type: 'custom',
          render: (value, record) => {
            if (value) {
              return (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    icon={<DeleteIcon />}
                    label="삭제됨"
                    color="error"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                    }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    삭제 일시: {new Date(value).toLocaleString('ko-KR')}
                  </Typography>
                </Box>
              );
            }
            return (
              <Chip
                label="활성"
                color="success"
                sx={{
                  fontWeight: 600,
                  fontSize: '0.875rem',
                }}
              />
            );
          },
        },
      ],
    },
    {
      title: '타임스탬프',
      icon: <InfoIcon />,
      columns: 2,
      fields: [
        {
          source: 'createdAt',
          label: '생성일시',
          type: 'date',
        },
        {
          source: 'updatedAt',
          label: '최종 수정일시',
          type: 'date',
        },
      ],
    },
  ];

  return (
    <GenericShow
      title="분류 상세보기"
      sections={sections}
      enableEdit={true}
      enableDelete={true}
      useTabs={false}
      queryOptions={{
        meta: {
          // JSON:API include 설정 (필요시 taxonomy 관계 포함)
          include: ['taxonomies'],
        },
      }}
    />
  );
};

export default TermShow;
