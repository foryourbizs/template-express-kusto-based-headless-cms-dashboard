import React, { useState, useCallback } from 'react';
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
  useNotify,
  useRefresh,
} from 'react-admin';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Alert,
  Chip,
  Avatar,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  CloudUpload,
  Download,
  Visibility,
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

// 파일 업로드 컴포넌트
const FileUploadComponent = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('originalName', file.name);

      // 파일 ID가 있다면 기존 파일 업데이트
      if (record?.id) {
        formData.append('fileId', record.id.toString());
      }

      const response = await fetch('/privates/files/upload/direct', {
        method: 'PUT',
        body: formData,
        // 진행률 추적을 위한 XMLHttpRequest 사용
      });

      if (!response.ok) {
        throw new Error(`업로드 실패: ${response.statusText}`);
      }

      const result = await response.json();
      
      notify('파일이 성공적으로 업로드되었습니다.', { type: 'success' });
      refresh();
      
    } catch (error) {
      console.error('Upload error:', error);
      notify(`파일 업로드 중 오류가 발생했습니다: ${error}`, { type: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [record, notify, refresh]);

  // 실제 XMLHttpRequest를 사용한 업로드 (진행률 추적)
  const uploadWithProgress = useCallback(async (file: File) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('originalName', file.name);
      
      if (record?.id) {
        formData.append('fileId', record.id.toString());
      }

      xhr.open('PUT', '/privates/files/upload/direct');
      xhr.send(formData);
    });
  }, [record]);

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
              현재 파일
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
            새 파일 업로드
          </Typography>
        )}

        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              업로드 중... {Math.round(uploadProgress)}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}
      </CardContent>

      <CardActions>
        <input
          accept="*/*"
          style={{ display: 'none' }}
          id="file-upload-button"
          type="file"
          onChange={handleFileUpload}
          disabled={uploading}
        />
        <label htmlFor="file-upload-button">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
            disabled={uploading}
          >
            {record?.filename ? '파일 교체' : '파일 업로드'}
          </Button>
        </label>
        
        {record?.filename && record?.exists && (
          <>
            <Button
              startIcon={<Download />}
              onClick={() => {
                // 다운로드 로직 구현
                window.open(`/api/files/${record.uuid}/download`, '_blank');
              }}
            >
              다운로드
            </Button>
            <Button
              startIcon={<Visibility />}
              onClick={() => {
                // 미리보기 로직 구현
                window.open(`/api/files/${record.uuid}/preview`, '_blank');
              }}
            >
              미리보기
            </Button>
          </>
        )}
      </CardActions>
    </Card>
  );
};

const FilesEdit = () => (
  <Edit actions={<EditActions />} title="파일 수정">
    <SimpleForm toolbar={<EditToolbar />}>
      <Box sx={{ width: '100%', maxWidth: 800 }}>
        
        {/* 파일 업로드 섹션 */}
        <FileUploadComponent />

        {/* 파일 메타데이터 섹션 */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            파일 정보
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextInput 
              source="filename" 
              label="파일명" 
              validate={required()}
              fullWidth
            />
            <TextInput 
              source="originalName" 
              label="원본 파일명" 
              validate={required()}
              fullWidth
            />
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextInput 
              source="mimeType" 
              label="MIME 타입" 
              fullWidth
            />
            <TextInput 
              source="extension" 
              label="확장자" 
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
            fullWidth
            sx={{ mt: 2 }}
            helperText="스토리지 내 파일 경로"
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
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            <TextInput 
              source="md5Hash" 
              label="MD5 해시" 
              fullWidth
            />
            <TextInput 
              source="sha256Hash" 
              label="SHA256 해시" 
              fullWidth
            />
          </Box>
        </Paper>

      </Box>
    </SimpleForm>
  </Edit>
);

export default FilesEdit;
