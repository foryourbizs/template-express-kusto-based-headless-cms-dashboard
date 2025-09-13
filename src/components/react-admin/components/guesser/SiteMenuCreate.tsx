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
  Alert,
} from '@mui/material';

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

export const SiteMenuCreate = () => (
  <Create
    title="메뉴 생성"
    redirect="list"
  >
    <SimpleForm toolbar={<SiteMenuCreateToolbar />}>
      <Alert severity="info" sx={{ mb: 2 }}>
        링크 URL, 타겟 등의 추가 정보는 메뉴 생성 후 메타데이터를 통해 설정할 수 있습니다.
      </Alert>

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
                <ReferenceInput
                  source="groupKeyUuid"
                  reference="privates/siteMenuGroup"
                  label="메뉴 그룹"
                >
                  <AutocompleteInput
                    optionText={(choice: any) => 
                      choice ? `${choice.name} (${choice.key})` : ''
                    }
                    optionValue="uuid"
                    filterToQuery={searchText => ({ 
                      'filter[name]': searchText 
                    })}
                    helperText="메뉴가 속할 그룹을 선택하세요"
                    validate={[required()]}
                    noOptionsText="검색 결과가 없습니다"
                    loadingText="로딩 중..."
                  />
                </ReferenceInput>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <SelectInput
                  source="type"
                  label="메뉴 타입"
                  choices={menuTypeChoices}
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
              validate={[maxLength(255)]}
              helperText="메뉴에 대한 설명을 입력하세요 (최대 255자)"
            />
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ width: '100%', mb: 2 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            메뉴 구조
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ReferenceInput
              source="parentUUID"
              reference="privates/siteMenu"
              label="부모 메뉴"
              filter={{ 'filter[deletedAt]': null }}
            >
              <AutocompleteInput
                optionText={(choice: any) => 
                  choice ? `${choice.title} (${choice.groupKeyUuid})` : ''
                }
                optionValue="uuid"
                filterToQuery={searchText => ({ 
                  'filter[title]': searchText 
                })}
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
