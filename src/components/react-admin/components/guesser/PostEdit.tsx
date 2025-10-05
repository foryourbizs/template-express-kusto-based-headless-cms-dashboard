import React from 'react';
import {
  Edit,
  SimpleForm,
  TextField,
  TextInput,
  NumberInput,
  BooleanInput,
  DateTimeInput,
  ReferenceInput,
  SelectInput,
  AutocompleteInput,
  required,
  minLength,
  maxLength,
  SaveButton,
  DeleteButton,
  ShowButton,
  ListButton,
  TopToolbar,
  useRecordContext,
  useNotify,
  useRedirect,
  useUpdate,
  FormDataConsumer,
} from 'react-admin';
import {
  Card,
  CardContent,
  Box,
  Typography,
  Divider,
  Alert,
  Chip,
  Avatar,
  FormControlLabel,
  Switch,
  Grid,
  Paper,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Article,
  Person,
  Settings,
  Visibility,
  Lock,
  Comment,
  Schedule,
  Image,
  Category,
} from '@mui/icons-material';

// 게시물 상태 선택지
const postStatusChoices = [
  { id: 'PUBLISHED', name: '게시됨' },
  { id: 'DRAFT', name: '임시저장' },
  { id: 'PENDING', name: '검토중' },
  { id: 'PRIVATE', name: '비공개' },
  { id: 'TRASH', name: '휴지통' },
];

// 게시물 타입 선택지
const postTypeChoices = [
  { id: 'POST', name: '게시물' },
  { id: 'PAGE', name: '페이지' },
  { id: 'ATTACHMENT', name: '첨부파일' },
  { id: 'REVISION', name: '리비전' },
  { id: 'MENU_ITEM', name: '메뉴 아이템' },
];

// 상단 툴바
const PostEditActions = () => (
  <TopToolbar>
    <ShowButton />
    <ListButton />
    <DeleteButton />
  </TopToolbar>
);

// 탭 패널 컴포넌트
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`post-tabpanel-${index}`}
      aria-labelledby={`post-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

// 슬러그 자동 생성 함수
const generateSlug = (title: string): string => {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

// 커스텀 폼 컴포넌트
const PostForm = () => {
  const record = useRecordContext();
  const [tabValue, setTabValue] = React.useState(0);
  const notify = useNotify();
  const redirect = useRedirect();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // 게시물 미리보기 URL 생성
  const getPreviewUrl = (record: any) => {
    if (!record?.slug) return null;
    return `/posts/${record.slug}`;
  };

  return (
    <Card>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="기본 정보" icon={<Article />} />
          <Tab label="내용" icon={<Article />} />
          <Tab label="설정" icon={<Settings />} />
          <Tab label="SEO" icon={<Visibility />} />
          <Tab label="고급" icon={<Settings />} />
        </Tabs>
      </Box>

      {/* 기본 정보 탭 */}
      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextInput
                source="title"
                label="제목"
                fullWidth
                validate={[required(), minLength(1), maxLength(255)]}
                helperText="게시물의 제목을 입력하세요"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormDataConsumer>
                {({ formData, ...rest }) => (
                  <TextInput
                    source="slug"
                    label="슬러그 (URL)"
                    fullWidth
                    validate={[required(), minLength(1), maxLength(200)]}
                    helperText="URL에 사용될 슬러그를 입력하세요"
                    defaultValue={formData.title ? generateSlug(formData.title) : ''}
                    {...rest}
                  />
                )}
              </FormDataConsumer>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <SelectInput
                source="postType"
                label="게시물 타입"
                choices={postTypeChoices}
                defaultValue="POST"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <SelectInput
                source="postStatus"
                label="상태"
                choices={postStatusChoices}
                defaultValue="DRAFT"
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <ReferenceInput
                source="authorUuid"
                reference="privates/users"
                label="작성자"
              >
                <AutocompleteInput
                  optionText="name"
                  filterToQuery={searchText => ({ name: searchText })}
                />
              </ReferenceInput>
            </Box>
            <Box sx={{ flex: 1 }}>
              <ReferenceInput
                source="parentUuid"
                reference="privates/posts"
                label="부모 게시물"
                filter={{ postType: 'PAGE' }}
              >
                <AutocompleteInput
                  optionText="title"
                  filterToQuery={searchText => ({ title: searchText })}
                />
              </ReferenceInput>
            </Box>
          </Box>

          <TextInput
            source="excerpt"
            label="요약"
            multiline
            rows={3}
            fullWidth
            validate={[maxLength(1000)]}
            helperText="게시물의 요약을 입력하세요 (최대 1000자)"
          />
        </Box>
      </TabPanel>

      {/* 내용 탭 */}
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextInput
            source="content"
            label="내용"
            multiline
            rows={15}
            fullWidth
            helperText="게시물의 본문 내용을 입력하세요"
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <TextInput
                source="featuredImage"
                label="대표 이미지 URL"
                fullWidth
                helperText="대표 이미지의 URL을 입력하세요"
              />
            </Box>
            <Box sx={{ flex: 1 }}>
              <NumberInput
                source="menuOrder"
                label="메뉴 순서"
                defaultValue={0}
                helperText="메뉴에서의 표시 순서"
              />
            </Box>
          </Box>

          {record?.featuredImage && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                대표 이미지 미리보기
              </Typography>
              <Avatar
                src={record.featuredImage}
                alt={record.title}
                sx={{ width: 200, height: 200 }}
                variant="rounded"
              >
                <Image sx={{ fontSize: 60 }} />
              </Avatar>
            </Box>
          )}
        </Box>
      </TabPanel>

      {/* 설정 탭 */}
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h6" gutterBottom>
            <Comment sx={{ mr: 1 }} />
            댓글 설정
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <BooleanInput
              source="allowComments"
              label="댓글 허용"
              defaultValue={true}
              helperText="이 게시물에 댓글을 허용할지 설정"
            />
            <BooleanInput
              source="allowPings"
              label="핑백/트랙백 허용"
              defaultValue={true}
              helperText="다른 사이트에서의 핑백/트랙백을 허용할지 설정"
            />
          </Box>

          <Divider />

          <Typography variant="h6" gutterBottom>
            <Lock sx={{ mr: 1 }} />
            보안 설정
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <BooleanInput
              source="isPasswordProtected"
              label="비밀번호 보호"
              defaultValue={false}
              helperText="이 게시물을 비밀번호로 보호"
            />
          </Box>

          <FormDataConsumer>
            {({ formData }) => 
              formData.isPasswordProtected && (
                <TextInput
                  source="postPassword"
                  label="게시물 비밀번호"
                  type="password"
                  helperText="게시물에 접근하기 위한 비밀번호"
                />
              )
            }
          </FormDataConsumer>

          <Divider />

          <Typography variant="h6" gutterBottom>
            <Schedule sx={{ mr: 1 }} />
            게시 일정
          </Typography>

          <DateTimeInput
            source="publishedAt"
            label="게시 일시"
            helperText="게시물이 공개될 날짜와 시간을 설정 (비어있으면 즉시 게시)"
          />
        </Box>
      </TabPanel>

      {/* SEO 탭 */}
      <TabPanel value={tabValue} index={3}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Alert severity="info">
            SEO 설정은 PostMeta를 통해 관리됩니다. 
            메타 키: seo_title, seo_description, seo_keywords 등
          </Alert>

          <TextInput
            source="seoTitle"
            label="SEO 제목"
            fullWidth
            validate={[maxLength(60)]}
            helperText="검색 엔진에 표시될 제목 (최대 60자)"
          />

          <TextInput
            source="seoDescription"
            label="SEO 설명"
            multiline
            rows={3}
            fullWidth
            validate={[maxLength(160)]}
            helperText="검색 엔진에 표시될 설명 (최대 160자)"
          />

          <TextInput
            source="seoKeywords"
            label="SEO 키워드"
            fullWidth
            helperText="쉼표로 구분된 키워드들"
          />

          {getPreviewUrl(record) && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                미리보기 URL
              </Typography>
              <Typography variant="body2" color="primary">
                {getPreviewUrl(record)}
              </Typography>
            </Box>
          )}
        </Box>
      </TabPanel>

      {/* 고급 탭 */}
      <TabPanel value={tabValue} index={4}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" gutterBottom>
            통계 정보
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <NumberInput
              source="viewCount"
              label="조회수"
              disabled
              helperText="게시물 조회 수 (자동 계산)"
            />
            <NumberInput
              source="commentCount"
              label="댓글 수"
              disabled
              helperText="댓글 수 (자동 계산)"
            />
          </Box>

          <Divider />

          <Typography variant="h6" gutterBottom>
            시스템 정보
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextInput source="uuid" label="UUID" disabled />
            <TextInput source="id" label="ID" disabled />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextInput source="createdAt" label="생성일" disabled />
            <TextInput source="updatedAt" label="수정일" disabled />
          </Box>

          <TextInput source="deletedAt" label="삭제일" disabled />
        </Box>
      </TabPanel>
    </Card>
  );
};

export const PostEdit = () => (
  <Edit actions={<PostEditActions />}>
    <SimpleForm>
      <PostForm />
    </SimpleForm>
  </Edit>
);

export default PostEdit;
