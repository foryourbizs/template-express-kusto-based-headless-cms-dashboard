import React from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  SelectInput,
  BooleanInput,
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  minLength,
  maxLength,
  SaveButton,
  Toolbar,
} from 'react-admin';
import { useWatch } from 'react-hook-form';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Alert,
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

// 메뉴 타입 선택지 (스키마의 MenuType enum에 맞춤)
const menuTypeChoices = [
  { id: 'INTERNAL_LINK', name: '내부 링크' },
  { id: 'EXTERNAL_LINK', name: '외부 링크' },
  { id: 'BUTTON', name: '버튼' },
];

// 커스텀 툴바
const SiteMenuCreateToolbar = () => (
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
              validate={[required(), minLength(1), maxLength(100)]}
              fullWidth
              helperText="사용자에게 표시될 메뉴 이름을 입력하세요"
            />
          </Box>
          
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <ReferenceInput
              source="groupKeyUuid"
              reference="privates/siteMenuGroup"
              label="메뉴 그룹"
            >
              <SelectInput
                optionText={(choice: any) => 
                  choice ? `${choice.name} (${choice.key})` : ''
                }
                optionValue="uuid"
                validate={[required()]}
                fullWidth
                helperText="메뉴가 속할 그룹을 선택하세요"
              />
            </ReferenceInput>
          </Box>
        </Box>
        
        <Box>
          <TextInput
            source="description"
            label="설명"
            multiline
            rows={3}
            fullWidth
            validate={[maxLength(255)]}
            helperText="메뉴에 대한 설명을 입력하세요 (최대 255자, 선택사항)"
          />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

// 계층 구조 섹션
const HierarchySection = () => {
  const selectedGroupUuid = useWatch({ name: 'groupKeyUuid' });
  
  return (
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
              filter={{ 
                'filter[deletedAt]': null,
                ...(selectedGroupUuid && { 'filter[groupKeyUuid]': selectedGroupUuid })
              }}
            >
              <SelectInput
                optionText={(choice: any) => 
                  choice ? `${choice.title}` : ''
                }
                optionValue="uuid"
                fullWidth
                helperText={
                  selectedGroupUuid 
                    ? "같은 그룹 내의 상위 메뉴를 선택하세요 (최상위 메뉴인 경우 비워두세요)"
                    : "먼저 메뉴 그룹을 선택해주세요"
                }
                disabled={!selectedGroupUuid}
                emptyText="상위 메뉴 없음 (최상위)"
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

        {!selectedGroupUuid && (
          <Alert severity="warning" sx={{ mt: 1 }}>
            상위 메뉴를 선택하려면 먼저 메뉴 그룹을 선택해야 합니다.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

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

// 메뉴 생성 컴포넌트
export const SiteMenuCreate = () => (
  <Create
    title="메뉴 생성"
    redirect="list"
  >
    <SimpleForm toolbar={<SiteMenuCreateToolbar />}>
      <Alert severity="info" sx={{ mb: 2 }}>
        링크 URL, 타겟 등의 추가 정보는 메뉴 생성 후 메타데이터를 통해 설정할 수 있습니다.
      </Alert>

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
  </Create>
);

export default SiteMenuCreate;
