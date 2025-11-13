import React, { useState } from 'react';
import {
  Show,
  TextField,
  BooleanField,
  ReferenceField,
  TopToolbar,
  ListButton,
  EditButton,
  useRecordContext,
  useNotify,
  useRedirect,
} from 'react-admin';
import {
  Box,
  Typography,
  Paper,
  Chip,
  Avatar,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import {
  InsertDriveFile,
  Image,
  VideoFile,
  AudioFile,
  PictureAsPdf,
  Description,
  Archive,
  Delete,
} from '@mui/icons-material';
import { requester } from '../../lib/client';

const ADMIN_SERVER_URL = process.env.NEXT_PUBLIC_ADMIN_SERVER_URL || '';

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

// 삭제 확인 다이얼로그 컴포넌트
const DeleteConfirmDialog = ({ open, onClose, onConfirm, fileName }: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName: string;
}) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>파일 삭제 확인</DialogTitle>
    <DialogContent>
      <DialogContentText>
        정말로 파일 "{fileName}"을(를) 삭제하시겠습니까?
        <br />
        삭제된 파일은 복구할 수 없습니다.
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        취소
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        삭제
      </Button>
    </DialogActions>
  </Dialog>
);

// 커스텀 삭제 버튼 컴포넌트
const CustomDeleteButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!record?.uuid) {
      notify('파일 UUID가 없습니다.', { type: 'error' });
      setOpen(false);
      return;
    }

    setDeleting(true);
    try {
      await requester(`${ADMIN_SERVER_URL}/privates/files/delete?fileUuid=${record.uuid}`, {
        method: 'DELETE',
      });
      
      notify('파일이 삭제되었습니다.', { type: 'success' });
      redirect('list', 'privates/files');
    } catch (error) {
      console.error('Delete error:', error);
      notify('파일 삭제 중 오류가 발생했습니다.', { type: 'error' });
    } finally {
      setDeleting(false);
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<Delete />}
        onClick={() => setOpen(true)}
        disabled={deleting}
        sx={{ ml: 2 }}
      >
        {deleting ? '삭제 중...' : '파일 삭제'}
      </Button>
      <DeleteConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        fileName={record?.filename || ''}
      />
    </>
  );
};

const ShowActions = () => (
  <TopToolbar>
    <ListButton />
    <EditButton />
    <CustomDeleteButton />
  </TopToolbar>
);

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
            파일 정보 없음
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

const FilesShow = () => (
  <Show actions={<ShowActions />} title="파일 상세">
    <Box sx={{ width: '100%', maxWidth: 800 }}>
      
      {/* 파일 정보 섹션 */}
      <FileInfoComponent />

      {/* 파일 메타데이터 섹션 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          파일 정보
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">파일명</Typography>
            <TextField source="filename" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">원본 파일명</Typography>
            <TextField source="originalName" />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">MIME 타입</Typography>
            <TextField source="mimeType" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">확장자</Typography>
            <TextField source="extension" />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">파일 크기</Typography>
            <TextField source="fileSize" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">UUID</Typography>
            <TextField source="uuid" />
          </Box>
        </Box>
      </Paper>

      {/* 스토리지 설정 섹션 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          스토리지 설정
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">오브젝트 스토리지</Typography>
          <ReferenceField source="storageUuid" reference="privates/objectStorages">
            <TextField source="name" />
          </ReferenceField>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">파일 경로</Typography>
          <TextField source="filePath" />
        </Box>
      </Paper>

      {/* 접근 제어 섹션 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          접근 제어
        </Typography>
        <Box sx={{ display: 'flex', gap: 4, mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">공개 파일</Typography>
            <BooleanField source="isPublic" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">아카이브</Typography>
            <BooleanField source="isArchived" />
          </Box>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">접근 권한</Typography>
          <ReferenceField source="accessPermissionUuid" reference="privates/users/permissions">
            <TextField source="name" />
          </ReferenceField>
        </Box>
      </Paper>

      {/* 업로드 정보 섹션 */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          업로드 정보
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">업로드 소스</Typography>
            <TextField source="uploadSource" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">생성일</Typography>
            <TextField source="createdAt" />
          </Box>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">수정일</Typography>
            <TextField source="updatedAt" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">파일 존재 여부</Typography>
            <BooleanField source="exists" />
          </Box>
        </Box>
      </Paper>

      {/* 메타데이터 섹션 */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom color="primary">
          추가 정보
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">메타데이터</Typography>
          <TextField source="metadata" />
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">MD5 해시</Typography>
            <TextField source="md5Hash" />
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">SHA256 해시</Typography>
            <TextField source="sha256Hash" />
          </Box>
        </Box>
      </Paper>

    </Box>
  </Show>
);

export default FilesShow;
