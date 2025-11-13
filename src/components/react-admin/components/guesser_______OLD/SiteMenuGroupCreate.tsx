import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  required,
  minLength,
  maxLength,
  SaveButton,
  Toolbar,
  regex,
} from 'react-admin';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Alert,
  Chip,
} from '@mui/material';
import {
  Group,
  Info,
  Key,
} from '@mui/icons-material';

// 커스텀 툴바
const SiteMenuGroupCreateToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

// 키 형식 검증 (영문자, 숫자, 언더스코어, 하이픈만 허용)
const keyValidation = [
  required(),
  minLength(1),
  maxLength(30),
  regex(/^[a-zA-Z0-9_-]+$/, '영문자, 숫자, 언더스코어(_), 하이픈(-)만 사용 가능합니다')
];

// 추천 그룹키 목록
const recommendedKeys = [
  { key: 'gnb', name: 'Global Navigation Bar', description: '전역 네비게이션 바' },
  { key: 'snb', name: 'Sub Navigation Bar', description: '서브 네비게이션 바' },
  { key: 'footer', name: 'Footer Menu', description: '푸터 메뉴' },
  { key: 'sidebar', name: 'Sidebar Menu', description: '사이드바 메뉴' },
  { key: 'admin', name: 'Admin Menu', description: '관리자 메뉴' },
  { key: 'mobile', name: 'Mobile Menu', description: '모바일 메뉴' },
  { key: 'breadcrumb', name: 'Breadcrumb Menu', description: '브레드크럼 메뉴' },
];

export const SiteMenuGroupCreate = () => (
  <Create
    title="메뉴 그룹 생성"
    redirect="list"
  >
    <SimpleForm toolbar={<SiteMenuGroupCreateToolbar />}>
      <Alert severity="info" sx={{ mb: 2 }}>
        메뉴 그룹은 관련된 메뉴들을 묶어서 관리하는 단위입니다. 
        생성 후에는 그룹 키를 변경할 수 없으니 신중하게 입력해주세요.
      </Alert>

      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Key color="primary" />
            <Typography variant="h6">그룹 식별자</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextInput
              source="key"
              label="그룹 키"
              fullWidth
              validate={keyValidation}
              helperText="메뉴 그룹을 식별하는 고유 키 (영문, 숫자, _, - 만 사용, 최대 30자)"
              placeholder="예: gnb, snb, footer"
            />
            
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>중요:</strong> 그룹 키는 생성 후 변경할 수 없습니다. 
                시스템에서 메뉴를 참조할 때 사용되므로 명확하고 일관된 이름을 사용하세요.
              </Typography>
            </Alert>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Info color="primary" />
            <Typography variant="h6">그룹 정보</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextInput
              source="name"
              label="그룹 이름"
              fullWidth
              validate={[required(), minLength(1), maxLength(100)]}
              helperText="사용자에게 표시될 그룹 이름을 입력하세요 (최대 100자)"
              placeholder="예: Global Navigation Bar"
            />

            <TextInput
              source="description"
              label="설명"
              multiline
              rows={3}
              fullWidth
              validate={[maxLength(255)]}
              helperText="그룹에 대한 설명을 입력하세요 (최대 255자, 선택사항)"
              placeholder="이 메뉴 그룹의 용도와 특징을 설명해주세요"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Group color="primary" />
            <Typography variant="h6">추천 그룹키</Typography>
          </Box>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            일반적으로 사용되는 메뉴 그룹키들입니다. 참고하여 적절한 키를 선택하세요.
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            {recommendedKeys.map((item, index) => (
              <Chip
                key={index}
                label={item.key}
                variant="outlined"
                size="small"
                color="primary"
                sx={{ fontSize: '0.75rem' }}
              />
            ))}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {recommendedKeys.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  label={item.key}
                  size="small"
                  variant="outlined"
                  sx={{ minWidth: 80, fontSize: '0.7rem' }}
                />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  - {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);

export default SiteMenuGroupCreate;
