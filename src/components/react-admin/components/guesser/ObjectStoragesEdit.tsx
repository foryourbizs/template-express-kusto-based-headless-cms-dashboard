import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  required,
  TopToolbar,
  ListButton,
  ShowButton,
  DeleteButton,
  SaveButton,
  Toolbar,
} from 'react-admin';
import { Box, Typography, Paper } from '@mui/material';

const EditActions = () => (
  <TopToolbar>
    <ListButton />
    <ShowButton />
    <DeleteButton />
  </TopToolbar>
);

const EditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

const ObjectStoragesEdit = () => (
  <Edit actions={<EditActions />} title="오브젝트 스토리지 수정">
    <SimpleForm toolbar={<EditToolbar />}>
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        
        {/* 기본 정보 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            기본 정보
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextInput 
              source="name" 
              label="스토리지명" 
              validate={required()}
              fullWidth
            />
            <SelectInput
              source="provider"
              label="제공업체"
              choices={[
                { id: 's3', name: 'Amazon S3' },
                { id: 'r2', name: 'Cloudflare R2' },
                { id: 'gcs', name: 'Google Cloud Storage' },
                { id: 'azure', name: 'Azure Blob Storage' },
                { id: 'minio', name: 'MinIO' },
                { id: 'other', name: '기타' },
              ]}
              validate={required()}
              fullWidth
            />
          </Box>
          <TextInput 
            source="description" 
            label="설명" 
            multiline
            rows={3}
            fullWidth
            sx={{ mt: 2 }}
          />
        </Paper>

        {/* 연결 정보 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            연결 정보
          </Typography>
          <TextInput 
            source="baseUrl" 
            label="Base URL" 
            validate={required()}
            fullWidth
            helperText="스토리지 서비스의 엔드포인트 URL"
          />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextInput 
              source="bucketName" 
              label="버킷명" 
              validate={required()}
              fullWidth
            />
            <TextInput 
              source="region" 
              label="리전" 
              defaultValue="auto"
              fullWidth
            />
          </Box>
        </Paper>

        {/* 상태 설정 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            상태 설정
          </Typography>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <BooleanInput 
              source="isDefault" 
              label="기본 스토리지로 설정"
              helperText="기본 스토리지는 하나만 설정할 수 있습니다"
            />
            <BooleanInput 
              source="isActive" 
              label="활성화"
              defaultValue={true}
            />
          </Box>
        </Paper>

        {/* 메타데이터 섹션 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            추가 설정
          </Typography>
          <TextInput 
            source="metadata" 
            label="메타데이터 (JSON)" 
            multiline
            rows={4}
            fullWidth
            helperText="JSON 형태의 추가 설정 정보"
          />
        </Paper>

      </Box>
    </SimpleForm>
  </Edit>
);

export default ObjectStoragesEdit;
