import React, { useState, useCallback } from 'react';
import {
  Create,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
  ReferenceInput,
  required,
  TopToolbar,
  ListButton,
  SaveButton,
  Toolbar,
  useNotify,
  useRedirect,
} from 'react-admin';
import {
  Box,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

const CreateActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

const CreateToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

// 파일 업로드 컴포넌트
const FileUploadComponent = ({ onFileUploaded }: { onFileUploaded: (fileData: any) => void }) => {
  const notify = useNotify();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<any>(null);

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
          const result = JSON.parse(xhr.responseText);
          resolve(result);
        } else {
          reject(new Error(`Upload failed: ${xhr.statusText}`));
        }
      };

      xhr.onerror = () => reject(new Error('Upload failed'));

      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);
      formData.append('originalName', file.name);

      xhr.open('PUT', '/privates/files/upload/direct');
      xhr.send(formData);
    });
  }, []);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const result = await uploadWithProgress(file);
      
      setUploadedFile({
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        extension: file.name.split('.').pop(),
        uploadSource: 'admin',
        ...(result as object)
      });

      onFileUploaded({
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        fileSize: file.size,
        extension: file.name.split('.').pop(),
        uploadSource: 'admin',
        ...(result as object)
      });
      
      notify('파일이 성공적으로 업로드되었습니다.', { type: 'success' });
      
    } catch (error) {
      console.error('Upload error:', error);
      notify(`파일 업로드 중 오류가 발생했습니다: ${error}`, { type: 'error' });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [uploadWithProgress, onFileUploaded, notify]);

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
        <Typography variant="h6" gutterBottom color="primary">
          파일 업로드
        </Typography>
        
        {uploadedFile ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            파일 '{uploadedFile.filename}' ({formatFileSize(uploadedFile.fileSize)})이 업로드되었습니다.
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            새 파일을 업로드하세요. 업로드된 파일 정보가 자동으로 폼에 채워집니다.
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
            파일 선택
          </Button>
        </label>
      </CardActions>
    </Card>
  );
};

const FilesCreate = () => {
  const [fileData, setFileData] = useState<any>({});

  const handleFileUploaded = useCallback((data: any) => {
    setFileData(data);
  }, []);

  return (
    <Create title="새 파일 추가">
      <SimpleForm 
        toolbar={<CreateToolbar />}
        defaultValues={fileData}
      >
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          
          {/* 파일 업로드 섹션 */}
          <FileUploadComponent onFileUploaded={handleFileUploaded} />

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
              helperText="스토리지 내 파일 경로 (자동 생성됨)"
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
                defaultValue={false}
                helperText="공개 파일은 누구나 접근 가능합니다"
              />
              <BooleanInput 
                source="isArchived" 
                label="아카이브"
                defaultValue={false}
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
              defaultValue="admin"
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
              placeholder='{"width": 1920, "height": 1080, "duration": 120}'
            />
          </Paper>

        </Box>
      </SimpleForm>
    </Create>
  );
};

export default FilesCreate;
