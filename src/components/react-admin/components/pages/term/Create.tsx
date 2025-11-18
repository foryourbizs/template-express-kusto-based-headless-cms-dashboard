"use client";

import { TextInput, required } from 'react-admin';
import { GenericCreateUpdate } from '../../guesser/GenericCreateUpdate';
import { Category as CategoryIcon, Link as LinkIcon } from '@mui/icons-material';

/**
 * Term Create Component
 * 분류(Term) 생성 페이지
 */
export const TermCreate = () => {
  // 폼 검증
  const validateTermCreation = (values: any) => {
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
      mode="create"
      title="분류 생성"
      description="카테고리, 태그 등에 사용될 새로운 분류를 추가합니다. 분류명과 URL에 사용될 슬러그를 입력하세요."
      sections={[
        {
          title: '기본 정보',
          icon: <CategoryIcon />,
          fields: [
            <TextInput
              key="name"
              source="name"
              label="분류명"
              helperText="사용자에게 표시될 분류 이름 (예: 기술, 뉴스, 공지사항)"
              validate={required('분류명은 필수 항목입니다')}
              fullWidth
            />,
            <TextInput
              key="slug"
              source="slug"
              label="URL 슬러그"
              helperText="URL에 사용될 고유 식별자 (예: technology, news, notice) - 영문 소문자, 숫자, 하이픈(-), 언더스코어(_)만 사용"
              validate={required('URL 슬러그는 필수 항목입니다')}
              fullWidth
            />,
          ],
        },
      ]}
      validate={validateTermCreation}
      defaultValues={{
        name: '',
        slug: '',
      }}
      redirect="list"
      saveButtonLabel="분류 생성"
      layout="standard"
      fieldSpacing={3}
      mutationOptions={{
        meta: {
          // JSON:API include 설정 (필요시)
        //   include: ['taxonomies']
        },
      }}
    />
  );
};

export default TermCreate;
