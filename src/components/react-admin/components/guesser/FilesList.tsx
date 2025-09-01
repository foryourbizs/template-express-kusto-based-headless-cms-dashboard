import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  EditButton,
  TopToolbar,
  CreateButton,
  ExportButton,
  RefreshButton,
  BulkDeleteButton,
  BulkExportButton,
  FunctionField,
  NumberField,
  ReferenceField,
  useListContext,
} from 'react-admin';
import { Chip, Box, Link, Avatar } from '@mui/material';
import {
  InsertDriveFile,
  Image,
  VideoFile,
  AudioFile,
  PictureAsPdf,
  Description,
  Archive,
} from '@mui/icons-material';

const ListActions = () => (
  <TopToolbar>
    <RefreshButton />
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const BulkActionButtons = () => (
  <>
    <BulkExportButton />
    <BulkDeleteButton />
  </>
);

// 파일 타입 아이콘 컴포넌트
const FileTypeIcon = ({ mimeType }: { mimeType: string }) => {
  const getIcon = () => {
    if (mimeType.startsWith('image/')) return <Image />;
    if (mimeType.startsWith('video/')) return <VideoFile />;
    if (mimeType.startsWith('audio/')) return <AudioFile />;
    if (mimeType === 'application/pdf') return <PictureAsPdf />;
    if (mimeType.includes('text/') || mimeType.includes('document')) return <Description />;
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return <Archive />;
    return <InsertDriveFile />;
  };

  const getColor = () => {
    if (mimeType.startsWith('image/')) return '#4CAF50';
    if (mimeType.startsWith('video/')) return '#FF5722';
    if (mimeType.startsWith('audio/')) return '#9C27B0';
    if (mimeType === 'application/pdf') return '#F44336';
    if (mimeType.includes('text/') || mimeType.includes('document')) return '#2196F3';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return '#FF9800';
    return '#757575';
  };

  return (
    <Avatar sx={{ bgcolor: getColor(), width: 32, height: 32 }}>
      {getIcon()}
    </Avatar>
  );
};

// 파일명과 아이콘을 함께 표시하는 컴포넌트
const FileNameField = ({ record }: any) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <FileTypeIcon mimeType={record.mimeType} />
    <Box>
      <Link 
        href="#" 
        underline="hover"
        sx={{ fontWeight: 'medium' }}
      >
        {record.filename}
      </Link>
      {record.originalName !== record.filename && (
        <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
          원본: {record.originalName}
        </Box>
      )}
    </Box>
  </Box>
);

// 파일 크기 표시 컴포넌트
const FileSizeField = ({ record }: any) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return <span>{formatFileSize(record.fileSize)}</span>;
};

// MIME 타입 칩 컴포넌트
const MimeTypeField = ({ record }: any) => {
  const getChipColor = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'success';
    if (mimeType.startsWith('video/')) return 'error';
    if (mimeType.startsWith('audio/')) return 'secondary';
    if (mimeType === 'application/pdf') return 'error';
    if (mimeType.includes('text/') || mimeType.includes('document')) return 'primary';
    return 'default';
  };

  return (
    <Chip 
      label={record.mimeType} 
      color={getChipColor(record.mimeType)}
      size="small"
    />
  );
};

// 파일 상태 표시 컴포넌트
const FileStatusField = ({ record }: any) => {
  if (record.deletedAt) {
    return <Chip label="삭제됨" color="error" size="small" />;
  }
  if (record.isArchived) {
    return <Chip label="아카이브됨" color="warning" size="small" />;
  }
  if (!record.exists) {
    return <Chip label="파일 없음" color="error" size="small" />;
  }
  if (record.isPublic) {
    return <Chip label="공개" color="success" size="small" />;
  }
  return <Chip label="비공개" color="default" size="small" />;
};

// 업로드 소스 표시
const UploadSourceField = ({ record }: any) => {
  if (!record.uploadSource) return null;
  
  const getSourceColor = (source: string) => {
    switch (source.toLowerCase()) {
      case 'web': return 'primary';
      case 'mobile': return 'secondary';
      case 'api': return 'info';
      default: return 'default';
    }
  };

  return (
    <Chip 
      label={record.uploadSource.toUpperCase()} 
      color={getSourceColor(record.uploadSource)}
      size="small"
      variant="outlined"
    />
  );
};

const FilesList = () => (
  <List 
    actions={<ListActions />}
    title="파일 관리"
    perPage={25}
  >
    <Datagrid 
      bulkActionButtons={<BulkActionButtons />}
      rowClick="edit"
    >
      <TextField source="id" label="ID" />
      <FunctionField 
        source="filename" 
        label="파일명"
        render={(record: any) => <FileNameField record={record} />}
      />
      <FunctionField 
        source="mimeType" 
        label="타입"
        render={(record: any) => <MimeTypeField record={record} />}
      />
      <FunctionField 
        source="fileSize" 
        label="크기"
        render={(record: any) => <FileSizeField record={record} />}
      />
      <ReferenceField
        source="storageUuid"
        reference="privates/objectStorages"
        label="스토리지"
        link={false}
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField source="filePath" label="경로" />
      <FunctionField 
        source="uploadSource" 
        label="업로드 방식"
        render={(record: any) => <UploadSourceField record={record} />}
      />
      <FunctionField 
        source="status" 
        label="상태"
        render={(record: any) => <FileStatusField record={record} />}
      />
      <DateField source="createdAt" label="업로드일" showTime />
      <EditButton />
    </Datagrid>
  </List>
);

export default FilesList;
