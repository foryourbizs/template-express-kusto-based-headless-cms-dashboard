import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  ReferenceInput,
  required,
  TopToolbar,
  ListButton,
  ShowButton,
  DeleteButton,
  SaveButton,
  Toolbar,
  useRecordContext,
} from 'react-admin';
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Avatar,
  Card,
  CardContent,
} from '@mui/material';
import {
  InsertDriveFile,
  Image,
  VideoFile,
  AudioFile,
  PictureAsPdf,
  Description,
  Archive,
} from '@mui/icons-material';

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

// 파일 타입 아이콘 컴포넌트
const FileTypeIcon = ({ mimeType }: { mimeType: string }) => {
  const getIcon = () => {
    if (mimeType?.startsWith('image/')) return <Image />;
    if (mimeType?.startsWith('video/')) return <VideoFile />;
    if (mimeType?.startsWith('audio/')) return <AudioFile />;
    if (mimeType === 'application/pdf') return <PictureAsPdf />;
    if (mimeType?.includes('text/') || mimeType?.includes('document')) return <Description />;
    if (mimeType?.includes('zip') || mimeType?.includes('compressed')) return <Archive />;
    return <InsertDriveFile />;
  };

  const getColor = () => {
    if (mimeType?.startsWith('image/')) return '#4CAF50';
    if (mimeType?.startsWith('video/')) return '#FF5722';
    if (mimeType?.startsWith('audio/')) return '#9C27B0';
    if (mimeType === 'application/pdf') return '#F44336';
    if (mimeType?.includes('text/') || mimeType?.includes('document')) return '#2196F3';
    if (mimeType?.includes('zip') || mimeType?.includes('compressed')) return '#FF9800';
    return '#757575';
  };

  return (
    <Avatar sx={{ bgcolor: getColor(), width: 48, height: 48 }}>
      {getIcon()}
    </Avatar>
  );
};

// 파일 정보 표시 컴포넌트
const FileInfoComponent = () => {
  const record = useRecordContext();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {record?.filename ? (
          <Box>
            <Typography variant="h6" gutterBottom color="primary">
              파일 정보
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <FileTypeIcon mimeType={record.mimeType} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {record.filename}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {record.mimeType} • {formatFileSize(record.fileSize)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  {record.exists ? (
                    <Chip label="파일 존재" color="success" size="small" />
                  ) : (
                    <Chip label="파일 없음" color="error" size="small" />
                  )}
                  {record.isPublic ? (
                    <Chip label="공개" color="info" size="small" />
                  ) : (
                    <Chip label="비공개" color="default" size="small" />
                  )}
                </Box>
              </Box>
            </Box>

          </Box>
        ) : (
          <Typography variant="h6" gutterBottom color="primary">
            새 파일
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const FilesEdit = () => (
  <Edit actions={<EditActions />} title="파일 수정">
    <SimpleForm toolbar={<EditToolbar />}>
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        
        {/* 파일 정보 섹션 */}
        <FileInfoComponent />

        {/* 파일 메타데이터 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            파일 정보 (읽기 전용)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextInput 
              source="filename" 
              label="파일명" 
              disabled
              fullWidth
            />
            <TextInput 
              source="originalName" 
              label="원본 파일명" 
              disabled
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextInput 
              source="mimeType" 
              label="MIME 타입" 
              disabled
              fullWidth
            />
            <TextInput 
              source="extension" 
              label="확장자" 
              disabled
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextInput 
              source="fileSize" 
              label="파일 크기 (bytes)" 
              disabled
              fullWidth
            />
            <TextInput 
              source="uuid" 
              label="파일 UUID" 
              disabled
              fullWidth
            />
          </Box>
        </Paper>

        {/* 스토리지 설정 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            스토리지 설정
          </Typography>
          <ReferenceInput
            source="storageUuid"
            reference="privates/objectStorages"
            label="오브젝트 스토리지"
          >
            <SelectInput 
              optionText="name" 
              optionValue="uuid"
              validate={required()}
              fullWidth
            />
          </ReferenceInput>
          <TextInput 
            source="filePath" 
            label="파일 경로" 
            disabled
            fullWidth
            sx={{ mt: 2 }}
            helperText="스토리지 내 파일 경로 (읽기 전용)"
          />
        </Paper>

        {/* 접근 제어 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            접근 제어
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
            <BooleanInput 
              source="isPublic" 
              label="공개 파일"
              helperText="공개 파일은 누구나 접근 가능합니다"
            />
            <BooleanInput 
              source="isArchived" 
              label="아카이브"
              helperText="아카이브된 파일은 삭제 예정입니다"
            />
          </Box>
          <ReferenceInput
            source="accessPermissionUuid"
            reference="privates/users/permissions"
            label="접근 권한"
          >
            <SelectInput 
              optionText="name" 
              optionValue="uuid"
              fullWidth
              helperText="NULL이면 공개 파일"
            />
          </ReferenceInput>
        </Paper>

        {/* 업로드 정보 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            업로드 정보
          </Typography>
          <SelectInput
            source="uploadSource"
            label="업로드 소스"
            choices={[
              { id: 'web', name: 'Web' },
              { id: 'mobile', name: 'Mobile' },
              { id: 'api', name: 'API' },
              { id: 'admin', name: 'Admin' },
            ]}
            fullWidth
          />
        </Paper>

        {/* 메타데이터 섹션 */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            추가 정보
          </Typography>
          <TextInput 
            source="metadata" 
            label="메타데이터 (JSON)" 
            multiline
            rows={4}
            fullWidth
            helperText="이미지 크기, 비디오 길이 등의 추가 정보"
          />
          <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, mb: 1 }} color="text.secondary">
            파일 해시 (읽기 전용)
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextInput 
              source="md5Hash" 
              label="MD5 해시" 
              disabled
              fullWidth
            />
            <TextInput 
              source="sha256Hash" 
              label="SHA256 해시" 
              disabled
              fullWidth
            />
          </Box>
        </Paper>

      </Box>
    </SimpleForm>
  </Edit>
);

export default FilesEdit;
