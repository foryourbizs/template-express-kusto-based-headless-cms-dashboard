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
  useCreate,
  useDataProvider,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
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
import { requester } from '../../lib/client';

const ADMIN_SERVER_URL = process.env.NEXT_PUBLIC_ADMIN_SERVER_URL || '';

const CreateActions = () => (
  <TopToolbar>
    <ListButton />
  </TopToolbar>
);

// 커스텀 Toolbar with 업로드 + 저장 로직
const CreateToolbarWithUpload = ({ selectedFile }: { selectedFile: File | null }) => {
  const notify = useNotify();
  const redirect = useRedirect();
  const [create] = useCreate();
  const [uploading, setUploading] = useState(false);
  const { getValues } = useFormContext(); // 폼 값 가져오기

  const handleSaveWithUpload = useCallback(async () => {
    if (!selectedFile) {
      notify('파일을 선택해주세요.', { type: 'error' });
      return;
    }

    // 현재 폼의 값들 가져오기
    const formData = getValues();
    
    // storageUuid 확인
    if (!formData.storageUuid) {
      notify('오브젝트 스토리지를 선택해주세요.', { type: 'error' });
      return;
    }

    setUploading(true);

    try {
      // 1. requester를 사용한 파일 업로드 (storageUuid 쿼리 파라미터 추가)
      const uploadFormData = new FormData();
      uploadFormData.append('files', selectedFile); // files 키로 배열에 단일 파일
    //   uploadFormData.append('filename', selectedFile.name);
    //   uploadFormData.append('originalName', selectedFile.name);

      // storageUuid를 쿼리 파라미터로 추가
      const uploadUrl = `${ADMIN_SERVER_URL}/privates/files/upload/direct?storageUuid=${formData.storageUuid}`;
      
      const uploadResponse = await requester(uploadUrl, {
        method: 'PUT',
        body: uploadFormData,
      });
      
      // 2. 업로드 결과와 폼 데이터 합쳐서 저장
      const completeData = {
        ...formData,
        filename: selectedFile.name,
        originalName: selectedFile.name,
        mimeType: selectedFile.type,
        fileSize: selectedFile.size,
        extension: selectedFile.name.split('.').pop(),
        uploadSource: formData.uploadSource || 'admin',
        ...uploadResponse.json
      };

      // 3. React Admin의 create 함수로 데이터베이스에 저장
      await create('privates/files', { data: completeData });
      
      notify('파일이 성공적으로 업로드되고 저장되었습니다.', { type: 'success' });
      redirect('list', 'privates/files');
      
    } catch (error) {
      console.error('Save error:', error);
      notify(`저장 중 오류가 발생했습니다: ${error}`, { type: 'error' });
    } finally {
      setUploading(false);
    }
  }, [selectedFile, create, notify, redirect, getValues]);

  return (
    <Toolbar>
      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            업로드 및 저장 중...
          </Typography>
          <LinearProgress />
        </Box>
      )}
      <SaveButton 
        onClick={handleSaveWithUpload}
        disabled={uploading || !selectedFile}
        label={uploading ? "저장 중..." : "저장"}
      />
    </Toolbar>
  );
};

// 파일 선택 컴포넌트 (업로드는 하지 않고 파일만 선택)
const FileSelectComponent = ({ onFileSelected }: { onFileSelected: (file: File | null) => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelected(file);
  }, [onFileSelected]);

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
          파일 선택
        </Typography>
        
        {selectedFile ? (
          <Alert severity="info" sx={{ mb: 2 }}>
            선택된 파일: &apos;{selectedFile.name}&apos; ({formatFileSize(selectedFile.size)})
            <br />
            저장 버튼을 누르면 파일이 업로드됩니다.
          </Alert>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            업로드할 파일을 선택하세요. 저장 시 파일이 업로드되고 데이터가 저장됩니다.
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <input
          accept="*/*"
          style={{ display: 'none' }}
          id="file-select-button"
          type="file"
          onChange={handleFileSelect}
        />
        <label htmlFor="file-select-button">
          <Button
            variant="contained"
            component="span"
            startIcon={<CloudUpload />}
          >
            파일 선택
          </Button>
        </label>
        
        {selectedFile && (
          <Button
            variant="outlined"
            onClick={() => {
              setSelectedFile(null);
              onFileSelected(null);
              // 파일 input 초기화
              const input = document.getElementById('file-select-button') as HTMLInputElement;
              if (input) input.value = '';
            }}
          >
            선택 취소
          </Button>
        )}
      </CardActions>
    </Card>
  );
};

const FilesCreate = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelected = useCallback((file: File | null) => {
    setSelectedFile(file);
  }, []);

  // 선택된 파일 기반의 기본값 설정
  const getDefaultValues = useCallback(() => {
    if (!selectedFile) return {};
    
    return {
      filename: selectedFile.name,
      originalName: selectedFile.name,
      mimeType: selectedFile.type,
      extension: selectedFile.name.split('.').pop(),
      uploadSource: 'admin',
      isPublic: false,
      isArchived: false,
    };
  }, [selectedFile]);

  return (
    <Create title="새 파일 추가">
      <SimpleForm 
        toolbar={<CreateToolbarWithUpload selectedFile={selectedFile} />}
        defaultValues={getDefaultValues()}
      >
        <Box sx={{ width: '100%', maxWidth: 800 }}>
          
          {/* 파일 선택 섹션 */}
          <FileSelectComponent onFileSelected={handleFileSelected} />

          {/* 파일 메타데이터 섹션 */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              파일 정보 (자동 설정됨)
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              파일명, MIME 타입, 확장자 등은 선택한 파일을 기반으로 자동 설정됩니다.
            </Typography>
            
            {/* 선택된 파일이 있는 경우 미리보기 정보 표시 */}
            {selectedFile && (
              <Box>
                <Typography variant="subtitle2" gutterBottom color="text.secondary">
                  미리보기 정보
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <Typography variant="body2">
                    <strong>파일명:</strong> {selectedFile.name}
                  </Typography>
                  <Typography variant="body2">
                    <strong>MIME 타입:</strong> {selectedFile.type}
                  </Typography>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 1 }}>
                  <Typography variant="body2">
                    <strong>파일 크기:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                  </Typography>
                  <Typography variant="body2">
                    <strong>확장자:</strong> {selectedFile.name.split('.').pop()}
                  </Typography>
                </Box>
              </Box>
            )}
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
                helperText="파일을 저장할 오브젝트 스토리지를 선택하세요"
              />
            </ReferenceInput>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              파일 경로는 업로드 시 자동으로 생성됩니다.
            </Typography>
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
              allowEmpty
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
              helperText="파일이 업로드되는 소스를 선택하세요"
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
