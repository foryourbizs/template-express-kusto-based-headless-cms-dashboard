"use client";

import {
  Create,
  Edit,
  SimpleForm,
  SimpleFormProps,
  CreateProps,
  EditProps,
  Toolbar,
  SaveButton,
  DeleteButton,
  ListButton,
  ShowButton,
  useRecordContext,
  useResourceContext,
} from 'react-admin';
import { ReactElement, ReactNode } from 'react';
import { SxProps, Theme, Box, Typography, Divider, Stack } from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';

/**
 * GenericCreateUpdate Props 인터페이스
 */
export interface GenericCreateUpdateProps {
  /**
   * 모드: 'create' 또는 'edit'
   * @default 'create'
   */
  mode?: 'create' | 'edit';

  /**
   * 폼 필드 배열
   * React Admin의 Input 컴포넌트들을 배열로 전달
   * sections를 사용하는 경우 선택 사항
   * @example [<TextInput source="name" />, <TextInput source="slug" />]
   */
  fields?: ReactElement[];

  /**
   * 폼 섹션 구성 (선택적)
   * 필드를 여러 섹션으로 그룹화
   * @example [
   *   { title: '기본 정보', fields: [field1, field2] },
   *   { title: '추가 정보', fields: [field3, field4] }
   * ]
   */
  sections?: Array<{
    title: string;
    description?: string;
    icon?: ReactElement;
    fields: ReactElement[];
    collapsible?: boolean;
    defaultExpanded?: boolean;
  }>;

  /**
   * 폼 제목
   * @example "분류 생성"
   */
  title?: string | ReactElement;

  /**
   * 폼 설명/도움말
   * @example "분류명과 URL 슬러그를 입력하세요"
   */
  description?: string | ReactElement;

  /**
   * 폼 검증 함수
   * @example (values) => { if (!values.name) return { name: '필수 항목입니다' } }
   */
  validate?: (values: any) => Record<string, any>;

  /**
   * 폼 기본값
   * @example { status: 'active', published: false }
   */
  defaultValues?: Record<string, any>;

  /**
   * 저장 후 리다이렉트 경로
   * @default "list"
   * @example "show" | "edit" | "list" | false | (resource, id, data) => string
   */
  redirect?: 'list' | 'show' | 'edit' | false | ((resource: string, id: any, data: any) => string);

  /**
   * 커스텀 툴바
   * false로 설정하면 툴바 비활성화
   */
  toolbar?: ReactElement | false;

  /**
   * 삭제 버튼 표시 (Edit 모드에서만)
   * @default true
   */
  enableDelete?: boolean;

  /**
   * 목록 버튼 표시
   * @default true
   */
  enableList?: boolean;

  /**
   * 상세보기 버튼 표시 (Edit 모드에서만)
   * @default false
   */
  enableShow?: boolean;

  /**
   * 저장 버튼 라벨
   * @default "저장"
   */
  saveButtonLabel?: string;

  /**
   * 저장 버튼 아이콘
   */
  saveButtonIcon?: ReactElement;

  /**
   * 뮤테이션 옵션
   * @example { meta: { include: ['taxonomy'] } }
   */
  mutationOptions?: {
    meta?: Record<string, any>;
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
    [key: string]: any;
  };

  /**
   * Create 컴포넌트 추가 Props
   */
  createProps?: Partial<CreateProps>;

  /**
   * Edit 컴포넌트 추가 Props
   */
  editProps?: Partial<EditProps>;

  /**
   * SimpleForm 추가 Props
   */
  formProps?: Partial<Omit<SimpleFormProps, 'children'>>;

  /**
   * 폼 컨테이너 커스텀 스타일
   */
  formSx?: SxProps<Theme>;

  /**
   * 폼 레이아웃
   * @default 'standard' - 표준 세로 레이아웃
   * @example 'compact' - 좁은 레이아웃
   * @example 'wide' - 넓은 레이아웃
   */
  layout?: 'standard' | 'compact' | 'wide';

  /**
   * 필드 간격
   * @default 3
   */
  fieldSpacing?: number;

  /**
   * 섹션 간격
   * @default 4
   */
  sectionSpacing?: number;

  /**
   * 폼 상단 추가 컨텐츠
   */
  headerContent?: ReactNode;

  /**
   * 폼 하단 추가 컨텐츠
   */
  footerContent?: ReactNode;

  /**
   * 자동 포커스 비활성화
   * @default false
   */
  disableAutoFocus?: boolean;

  /**
   * 필드를 두 열로 표시
   * @default false
   */
  twoColumn?: boolean;

  /**
   * 카드 스타일 비활성화
   * @default false
   */
  disableCard?: boolean;
}

/**
 * CustomToolbar - 액션 버튼들을 포함한 커스텀 툴바
 */
const CustomToolbar = ({
  enableDelete = true,
  enableList = true,
  enableShow = false,
  saveButtonLabel = '저장',
  saveButtonIcon,
  mode = 'create',
}: {
  enableDelete?: boolean;
  enableList?: boolean;
  enableShow?: boolean;
  saveButtonLabel?: string;
  saveButtonIcon?: ReactElement;
  mode?: 'create' | 'edit';
}) => {
  const record = useRecordContext();

  return (
    <Toolbar
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        padding: { xs: '12px 16px', sm: '16px 24px' },
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* 왼쪽: 저장 버튼 */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <SaveButton
          label={saveButtonLabel}
          icon={saveButtonIcon}
          variant="contained"
          sx={{
            borderRadius: 1.5,
            paddingX: { xs: 2, sm: 3 },
            paddingY: { xs: 1, sm: 1.25 },
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        />
      </Box>

      {/* 오른쪽: 네비게이션 및 삭제 버튼 */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        {enableList && (
          <ListButton
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              paddingX: { xs: 2, sm: 2.5 },
              paddingY: { xs: 0.75, sm: 1 },
            }}
          />
        )}
        {mode === 'edit' && enableShow && record && (
          <ShowButton
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              paddingX: { xs: 2, sm: 2.5 },
              paddingY: { xs: 0.75, sm: 1 },
            }}
          />
        )}
        {mode === 'edit' && enableDelete && record && (
          <DeleteButton
            variant="outlined"
            color="error"
            sx={{
              borderRadius: 1.5,
              paddingX: { xs: 2, sm: 2.5 },
              paddingY: { xs: 0.75, sm: 1 },
            }}
          />
        )}
      </Box>
    </Toolbar>
  );
};

/**
 * SectionHeader - 섹션 헤더 컴포넌트
 */
const SectionHeader = ({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactElement;
}) => (
  <Box sx={{ mb: 2.5 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: description ? 1 : 0 }}>
      {icon && (
        <Box
          sx={{
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            '& .MuiSvgIcon-root': { fontSize: '1.5rem' },
          }}
        >
          {icon}
        </Box>
      )}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1rem', sm: '1.125rem' },
          color: 'text.primary',
        }}
      >
        {title}
      </Typography>
    </Box>
    {description && (
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          pl: icon ? 5 : 0,
        }}
      >
        {description}
      </Typography>
    )}
  </Box>
);

/**
 * GenericCreateUpdate - 재사용 가능한 범용 Create/Edit 컴포넌트
 * 
 * React Admin의 Create/Edit + SimpleForm을 래핑하여
 * 설정 기반으로 쉽게 생성/수정 페이지를 구성할 수 있습니다.
 * 
 * @example 기본 사용법 (Create)
 * ```tsx
 * <GenericCreateUpdate
 *   mode="create"
 *   fields={[
 *     <TextInput source="name" label="이름" required />,
 *     <TextInput source="slug" label="슬러그" required />
 *   ]}
 *   title="분류 생성"
 *   description="새로운 분류를 추가합니다"
 * />
 * ```
 * 
 * @example 섹션을 사용한 그룹화 (Edit)
 * ```tsx
 * <GenericCreateUpdate
 *   mode="edit"
 *   sections={[
 *     {
 *       title: '기본 정보',
 *       icon: <InfoIcon />,
 *       fields: [
 *         <TextInput source="name" label="이름" />,
 *         <TextInput source="slug" label="슬러그" />
 *       ]
 *     },
 *     {
 *       title: '추가 설정',
 *       fields: [
 *         <SelectInput source="status" choices={[...]} />
 *       ]
 *     }
 *   ]}
 *   enableDelete={true}
 *   enableShow={true}
 * />
 * ```
 * 
 * @example 고급 커스터마이징
 * ```tsx
 * <GenericCreateUpdate
 *   mode="create"
 *   fields={fields}
 *   validate={validateForm}
 *   defaultValues={{ status: 'draft' }}
 *   layout="wide"
 *   twoColumn={true}
 *   mutationOptions={{
 *     meta: { include: ['taxonomy'] },
 *     onSuccess: () => notify('저장 완료!', { type: 'success' })
 *   }}
 * />
 * ```
 */
export const GenericCreateUpdate = ({
  mode = 'create',
  fields = [],
  sections,
  title,
  description,
  validate,
  defaultValues,
  redirect = 'list',
  toolbar,
  enableDelete = true,
  enableList = true,
  enableShow = false,
  saveButtonLabel = '저장',
  saveButtonIcon,
  mutationOptions,
  createProps = {},
  editProps = {},
  formProps = {},
  formSx,
  layout = 'standard',
  fieldSpacing = 3,
  sectionSpacing = 4,
  headerContent,
  footerContent,
  disableAutoFocus = false,
  twoColumn = false,
  disableCard = false,
}: GenericCreateUpdateProps) => {
  
  // 레이아웃에 따른 최대 너비 설정
  const getMaxWidth = () => {
    switch (layout) {
      case 'compact':
        return '600px';
      case 'wide':
        return '1200px';
      case 'standard':
      default:
        return '900px';
    }
  };

  // 기본 폼 스타일
  const defaultFormSx: SxProps<Theme> = {
    // 폼 컨테이너
    '& .RaSimpleForm-main': {
      maxWidth: getMaxWidth(),
      margin: '0 auto',
      padding: { xs: 2, sm: 3, md: 4 },
      backgroundColor: disableCard ? 'transparent' : 'background.paper',
      borderRadius: disableCard ? 0 : 2,
      boxShadow: disableCard ? 'none' : '0 2px 12px rgba(0,0,0,0.08)',
    },
    // 모든 입력 필드 스타일링
    '& .MuiFormControl-root': {
      width: '100%',
      marginBottom: fieldSpacing,
    },
    '& .MuiInputBase-root': {
      backgroundColor: 'background.default',
      borderRadius: 1.5,
      transition: 'all 0.2s ease-in-out',
      '&:hover:not(.Mui-disabled)': {
        backgroundColor: 'action.hover',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      },
      '&.Mui-focused': {
        backgroundColor: 'background.paper',
        boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)',
      },
    },
    '& .MuiInputLabel-root': {
      fontWeight: 500,
      fontSize: '0.938rem',
      '&.Mui-focused': {
        color: 'primary.main',
        fontWeight: 600,
      },
    },
    '& .MuiInputBase-input': {
      padding: '14px 16px',
      fontSize: '0.938rem',
    },
    // TextArea 스타일
    '& .MuiInputBase-multiline': {
      padding: 0,
      '& textarea': {
        padding: '14px 16px',
      },
    },
    // 헬퍼 텍스트
    '& .MuiFormHelperText-root': {
      marginTop: '6px',
      marginLeft: '2px',
      fontSize: '0.813rem',
      lineHeight: 1.4,
    },
    // 필수 표시
    '& .MuiFormLabel-asterisk': {
      color: 'error.main',
    },
    // Select 드롭다운
    '& .MuiSelect-select': {
      padding: '14px 16px',
    },
    // 체크박스/라디오
    '& .MuiCheckbox-root, & .MuiRadio-root': {
      '&.Mui-checked': {
        color: 'primary.main',
      },
    },
    // 에러 상태
    '& .Mui-error': {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'error.main',
        borderWidth: '2px',
      },
    },
    ...formSx,
  };

  // 툴바 결정
  const resolveToolbar = () => {
    if (toolbar !== undefined) {
      return toolbar;
    }
    return (
      <CustomToolbar
        enableDelete={enableDelete}
        enableList={enableList}
        enableShow={enableShow}
        saveButtonLabel={saveButtonLabel}
        saveButtonIcon={saveButtonIcon}
        mode={mode}
      />
    );
  };

  // 폼 헤더 렌더링
  const renderHeader = () => {
    if (!title && !description && !headerContent) return null;

    return (
      <Box sx={{ mb: 4 }}>
        {(title || description) && (
          <Box sx={{ mb: headerContent ? 3 : 0 }}>
            {title && (
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: 'text.primary',
                  mb: description ? 1.5 : 0,
                }}
              >
                {title}
              </Typography>
            )}
            {description && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  padding: 2,
                  backgroundColor: 'info.lighter',
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'info.light',
                }}
              >
                <InfoIcon sx={{ color: 'info.main', fontSize: '1.25rem', mt: 0.25 }} />
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    flex: 1,
                  }}
                >
                  {description}
                </Typography>
              </Box>
            )}
          </Box>
        )}
        {headerContent && <Box>{headerContent}</Box>}
      </Box>
    );
  };

  // 필드 렌더링 (섹션 사용 시)
  const renderSections = () => {
    if (!sections || sections.length === 0) return null;

    return (
      <Stack spacing={sectionSpacing}>
        {sections.map((section, index) => (
          <Box key={index}>
            {section.title && (
              <SectionHeader
                title={section.title}
                description={section.description}
                icon={section.icon}
              />
            )}
            <Box
              sx={
                twoColumn
                  ? {
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: { xs: fieldSpacing, md: 3 },
                    }
                  : {}
              }
            >
              {section.fields}
            </Box>
            {index < sections.length - 1 && (
              <Divider sx={{ mt: sectionSpacing, borderColor: 'divider', opacity: 0.6 }} />
            )}
          </Box>
        ))}
      </Stack>
    );
  };

  // 일반 필드 렌더링 (섹션 미사용 시)
  const renderFields = () => {
    if (sections && sections.length > 0) return null;

    if (twoColumn) {
      return (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: fieldSpacing, md: 3 },
          }}
        >
          {fields}
        </Box>
      );
    }

    return <>{fields}</>;
  };

  // SimpleForm Props 병합
  const mergedFormProps: Partial<SimpleFormProps> = {
    defaultValues,
    validate,
    toolbar: resolveToolbar(),
    sx: defaultFormSx,
    ...formProps,
  };

  // 폼 내용
  const FormContent = () => (
    <>
      {renderHeader()}
      {renderSections()}
      {renderFields()}
      {footerContent && <Box sx={{ mt: 4 }}>{footerContent}</Box>}
    </>
  );

  // Create 모드
  if (mode === 'create') {
    const mergedCreateProps: Partial<CreateProps> = {
      redirect,
      ...mutationOptions,
      ...createProps,
    };

    return (
      <Create {...mergedCreateProps}>
        <SimpleForm {...mergedFormProps}>
          <FormContent />
        </SimpleForm>
      </Create>
    );
  }

  // Edit 모드
  const mergedEditProps: Partial<EditProps> = {
    redirect,
    mutationMode: 'pessimistic',
    ...mutationOptions,
    ...editProps,
  };

  return (
    <Edit {...mergedEditProps}>
      <SimpleForm {...mergedFormProps}>
        <FormContent />
      </SimpleForm>
    </Edit>
  );
};

export default GenericCreateUpdate;
