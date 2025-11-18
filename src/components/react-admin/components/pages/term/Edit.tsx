"use client";

import { TextInput, required } from 'react-admin';
import { GenericCreateUpdate } from '../../guesser/GenericCreateUpdate';
import { Category as CategoryIcon } from '@mui/icons-material';
import { Box, Chip } from '@mui/material';

/**
 * Term Edit Component
 * 분류(Term) 수정 페이지
 */
export const TermEdit = () => {
  // 폼 검증
  const validateTermEdit = (values: any) => {
    const errors: any = {};

    if (!values.name || values.name.trim() === '') {
      errors.name = '분류명은 필수 항목입니다';
    } else if (values.name.length > 200) {
      errors.name = '분류명은 200자를 초과할 수 없습니다';
    }

    if (!values.slug || values.slug.trim() === '') {
      errors.slug = 'URL 슬러그는 필수 항목입니다';
    } else if (values.slug.length > 200) {
      errors.slug = 'URL 슬러그는 200자를 초과할 수 없습니다';
    } else if (!/^[a-z0-9-_]+$/.test(values.slug)) {
      errors.slug = '슬러그는 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)만 사용 가능합니다';
    }

    return errors;
  };

  return (
    <GenericCreateUpdate
      mode="edit"
      title="분류 수정"
      description="분류의 정보를 수정합니다. 슬러그 변경 시 기존 URL에 영향을 줄 수 있으니 주의하세요."
      sections={[
        {
          title: '기본 정보',
          icon: <CategoryIcon />,
          fields: [
            <TextInput
              key="name"
              source="name"
              label="분류명"
              helperText="사용자에게 표시될 분류 이름"
              validate={required('분류명은 필수 항목입니다')}
              fullWidth
            />,
            <TextInput
              key="slug"
              source="slug"
              label="URL 슬러그"
              helperText="⚠️ 슬러그 변경 시 기존 URL이 변경되어 링크가 끊어질 수 있습니다"
              validate={required('URL 슬러그는 필수 항목입니다')}
              fullWidth
            />,
          ],
        },
      ]}
      validate={validateTermEdit}
      redirect="show"
      saveButtonLabel="변경사항 저장"
      enableDelete={true}
      enableList={true}
      enableShow={true}
      layout="standard"
      fieldSpacing={3}
      sectionSpacing={5}
      twoColumn={false}
      mutationOptions={{
        meta: {
          // JSON:API include 설정 (필요시)
          // include: ['taxonomies']
        },
      }}
      headerContent={
        <Box sx={{ mb: 2 }}>
          <Chip
            label="편집 모드"
            color="primary"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Box>
      }
    />
  );
};

export default TermEdit;
