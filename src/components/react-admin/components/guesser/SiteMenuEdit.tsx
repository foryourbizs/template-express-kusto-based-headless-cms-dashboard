import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  useEditContext,
  TopToolbar,
  ListButton,
  ShowButton,
  DeleteButton,
  SaveButton,
  Toolbar,
  useNotify,
  useRedirect,
  useUpdate,
} from 'react-admin';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import {
  Menu,
  Link,
  ExitToApp,
  TouchApp,
  Visibility,
  Security,
  Sort,
} from '@mui/icons-material';

// 메뉴 타입 선택지
const menuTypeChoices = [
  { id: 'INTERNAL_LINK', name: '내부 링크' },
  { id: 'EXTERNAL_LINK', name: '외부 링크' },
  { id: 'BUTTON', name: '버튼' },
];

// 그룹키 선택지 (실제로는 API에서 가져와야 함)
const groupKeyChoices = [
  { id: 'gnb', name: 'GNB (Global Navigation Bar)' },
  { id: 'snb', name: 'SNB (Sub Navigation Bar)' },
  { id: 'footer', name: 'Footer Menu' },
  { id: 'sidebar', name: 'Sidebar Menu' },
  { id: 'admin', name: 'Admin Menu' },
];

// 상단 액션 툴바
const EditActions = () => (
  <TopToolbar>
    <ListButton />
    <ShowButton />
    <DeleteButton
      confirmTitle="메뉴 삭제"
      confirmContent="이 메뉴를 삭제하시겠습니까? 하위 메뉴가 있는 경우 함께 삭제됩니다."
    />
  </TopToolbar>
);

// 커스텀 툴바
const EditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

// 메뉴 정보 섹션
const MenuInfoSection = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Menu color="primary" />
        <Typography variant="h6">기본 정보</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <TextInput
              source="title"
              label="메뉴명"
              validate={[required()]}
              fullWidth
              helperText="사용자에게 표시될 메뉴 이름을 입력하세요"
            />
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <SelectInput
              source="groupKey"
              label="그룹 키"
              choices={groupKeyChoices}
              validate={[required()]}
              fullWidth
              helperText="메뉴가 속할 그룹을 선택하세요"
            />
          </Box>
        </Box>
        
        <Box>
          <TextInput
            source="description"
            label="설명"
            multiline
            rows={3}
            fullWidth
            helperText="메뉴에 대한 설명을 입력하세요 (선택사항)"
          />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// 계층 구조 섹션
const HierarchySection = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Sort color="primary" />
        <Typography variant="h6">계층 구조</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <ReferenceInput
            source="parentUUID"
            reference="privates/siteMenu"
            label="상위 메뉴"
            filter={{ deletedAt: null }}
          >
            <AutocompleteInput
              optionText={(choice: any) => 
                choice ? `${choice.title} (${choice.groupKey})` : ''
              }
              optionValue="uuid"
              fullWidth
              helperText="상위 메뉴를 선택하세요 (최상위 메뉴인 경우 비워두세요)"
            />
          </ReferenceInput>
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <NumberInput
            source="displayOrder"
            label="표시 순서"
            fullWidth
            helperText="같은 레벨에서의 메뉴 순서 (숫자가 작을수록 먼저 표시)"
            min={0}
            defaultValue={0}
          />
        </Box>
      </Box>
      
      <Alert severity="info" sx={{ mt: 2 }}>
        계층 구조는 최대 3단계까지 지원됩니다. 상위 메뉴를 선택하지 않으면 최상위 메뉴가 됩니다.
      </Alert>
    </CardContent>
  </Card>
);

// 메뉴 타입 섹션
const MenuTypeSection = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Link color="primary" />
        <Typography variant="h6">메뉴 타입</Typography>
      </Box>
      
      <SelectInput
        source="type"
        label="메뉴 유형"
        choices={menuTypeChoices}
        validate={[required()]}
        fullWidth
        helperText="메뉴의 동작 방식을 선택하세요"
        defaultValue="INTERNAL_LINK"
      />
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>메뉴 타입 설명:</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Link fontSize="small" />
            <Typography variant="body2">
              <strong>내부 링크:</strong> 사이트 내부 페이지로 이동
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ExitToApp fontSize="small" />
            <Typography variant="body2">
              <strong>외부 링크:</strong> 다른 사이트로 이동
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TouchApp fontSize="small" />
            <Typography variant="body2">
              <strong>버튼:</strong> 특정 액션 실행 (JavaScript 함수 호출 등)
            </Typography>
          </Box>
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// 접근 권한 섹션
const AccessControlSection = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Security color="primary" />
        <Typography variant="h6">접근 권한</Typography>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <BooleanInput
            source="isPublic"
            label="공개 메뉴"
            helperText="체크하면 모든 사용자가 볼 수 있습니다"
            defaultValue={true}
          />
        </Box>
        
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <BooleanInput
            source="requireLogin"
            label="로그인 필요"
            helperText="체크하면 로그인한 사용자만 볼 수 있습니다"
            defaultValue={false}
          />
        </Box>
      </Box>
      
      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>권한 설정 안내:</strong><br />
          • 공개 메뉴가 아닌 경우, 역할별 권한 설정이 필요합니다<br />
          • 로그인이 필요한 메뉴는 비로그인 사용자에게 표시되지 않습니다
        </Typography>
      </Alert>
    </CardContent>
  </Card>
);

// 메타데이터 섹션 (향후 확장용)
const MetadataSection = () => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Visibility color="primary" />
        <Typography variant="h6">추가 설정</Typography>
      </Box>
      
      <Alert severity="info">
        메타데이터 및 역할별 권한 설정은 메뉴 생성 후 별도 관리 페이지에서 설정할 수 있습니다.
      </Alert>
    </CardContent>
  </Card>
);

// 메뉴 편집 컴포넌트
export const SiteMenuEdit = () => {
  return (
    <Edit
      actions={<EditActions />}
      title="메뉴 편집"
      mutationMode="pessimistic"
    >
      <SimpleForm toolbar={<EditToolbar />}>
        {/* 숨겨진 UUID 필드 */}
        <TextInput source="uuid" sx={{ display: 'none' }} />
        
        {/* 기본 정보 */}
        <MenuInfoSection />
        
        {/* 계층 구조 */}
        <HierarchySection />
        
        {/* 메뉴 타입 */}
        <MenuTypeSection />
        
        {/* 접근 권한 */}
        <AccessControlSection />
        
        {/* 메타데이터 */}
        <MetadataSection />
      </SimpleForm>
    </Edit>
  );
};

export default SiteMenuEdit;
