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
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
} from '@mui/material';

// 메뉴 타입 선택지
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

export const SiteMenuCreate = () => (
  <Create
    title="메뉴 생성"
    redirect="list"
  >
    <SimpleForm toolbar={<SiteMenuCreateToolbar />}>
      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            기본 정보
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <TextInput
                  source="title"
                  label="메뉴명"
                  fullWidth
                  validate={[required(), minLength(1), maxLength(100)]}
                  helperText="메뉴에 표시될 이름을 입력하세요"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextInput
                  source="groupKey"
                  label="그룹키"
                  fullWidth
                  validate={[required(), minLength(1), maxLength(50)]}
                  helperText="메뉴 그룹을 식별하는 키를 입력하세요"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <SelectInput
                  source="type"
                  label="메뉴 타입"
                  choices={menuTypeChoices}
                  validate={[required()]}
                  defaultValue="INTERNAL_LINK"
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <NumberInput
                  source="displayOrder"
                  label="표시 순서"
                  defaultValue={0}
                  helperText="메뉴의 표시 순서 (낮을수록 먼저 표시)"
                />
              </Box>
            </Box>

            <TextInput
              source="description"
              label="설명"
              multiline
              rows={3}
              fullWidth
              validate={[maxLength(500)]}
              helperText="메뉴에 대한 설명을 입력하세요 (최대 500자)"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            링크 설정
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextInput
              source="href"
              label="링크 URL"
              fullWidth
              helperText="메뉴 클릭 시 이동할 URL을 입력하세요"
            />

            <TextInput
              source="target"
              label="링크 타겟"
              fullWidth
              defaultValue="_self"
              helperText="링크 열기 방식 (_self, _blank 등)"
            />

            <ReferenceInput
              source="parentUuid"
              reference="privates/siteMenu"
              label="부모 메뉴"
            >
              <AutocompleteInput
                optionText="title"
                filterToQuery={searchText => ({ title: searchText })}
                helperText="상위 메뉴를 선택하세요 (선택사항)"
              />
            </ReferenceInput>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            접근 권한
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <BooleanInput
              source="isPublic"
              label="공개 메뉴"
              defaultValue={true}
              helperText="모든 사용자에게 표시"
            />
            <BooleanInput
              source="requireLogin"
              label="로그인 필수"
              defaultValue={false}
              helperText="로그인한 사용자만 접근 가능"
            />
          </Box>
        </CardContent>
      </Card>
    </SimpleForm>
  </Create>
);

export default SiteMenuCreate;
