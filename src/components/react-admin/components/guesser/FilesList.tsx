import React, { useState } from 'react';
import {
  List,
  TopToolbar,
  CreateButton,
  ExportButton,
  RefreshButton,
  useListContext,
  Pagination,
} from 'react-admin';
import { 
  Chip, 
  Box, 
  Link, 
  Avatar, 
  Dialog, 
  DialogContent, 
  DialogTitle, 
  IconButton,
  Typography,
  Card,
  CardMedia,
  Tooltip,
  Stack
} from '@mui/material';
import {
  InsertDriveFile,
  Image,
  VideoFile,
  AudioFile,
  PictureAsPdf,
  Description,
  Archive,
  Close,
  Visibility,
  Download,
  Share
} from '@mui/icons-material';
import { EmptyList } from '../common/EmptyList';
import GroupedTable, { TableColumn, GroupedTableData } from '../common/GroupedTable';

// 파일 유형별 아이콘 매핑
const getFileIcon = (mimeType: string) => {
  if (mimeType?.startsWith('image/')) {
    return <Image color="primary" />;
  } else if (mimeType?.startsWith('video/')) {
    return <VideoFile color="secondary" />;
  } else if (mimeType?.startsWith('audio/')) {
    return <AudioFile color="info" />;
  } else if (mimeType === 'application/pdf') {
    return <PictureAsPdf color="error" />;
  } else if (mimeType?.includes('zip') || mimeType?.includes('rar') || mimeType?.includes('tar')) {
    return <Archive color="warning" />;
  } else if (mimeType?.includes('text') || mimeType?.includes('document')) {
    return <Description color="success" />;
  }
  return <InsertDriveFile />;
};

// 파일 유형별 그룹화
const groupFilesByType = (fileData: any[]): GroupedTableData[] => {
  const grouped = new Map();
  
  fileData.forEach(file => {
    let groupKey: string;
    let groupName: string;
    
    const mimeType = file.mimeType || file.contentType || '';
    
    if (mimeType.startsWith('image/')) {
      groupKey = 'images';
      groupName = '이미지 파일';
    } else if (mimeType.startsWith('video/')) {
      groupKey = 'videos';
      groupName = '비디오 파일';
    } else if (mimeType.startsWith('audio/')) {
      groupKey = 'audios';
      groupName = '오디오 파일';
    } else if (mimeType === 'application/pdf') {
      groupKey = 'pdfs';
      groupName = 'PDF 문서';
    } else if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) {
      groupKey = 'archives';
      groupName = '압축 파일';
    } else if (mimeType.includes('text') || mimeType.includes('document')) {
      groupKey = 'documents';
      groupName = '문서 파일';
    } else {
      groupKey = 'others';
      groupName = '기타 파일';
    }
    
    if (!grouped.has(groupKey)) {
      grouped.set(groupKey, {
        groupKey,
        groupName,
        items: []
      });
    }
    
    grouped.get(groupKey).items.push(file);
  });
  
  // 그룹 순서 정의
  const order = ['images', 'videos', 'audios', 'pdfs', 'documents', 'archives', 'others'];
  return order
    .map(key => grouped.get(key))
    .filter(group => group && group.items.length > 0);
};

// 파일 크기 포맷팅 함수
const formatFileSize = (bytes: number) => {
  if (!bytes) return '-';
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

// 파일 미리보기 모달 컴포넌트
const FilePreviewModal = ({ file, open, onClose }: { 
  file: any; 
  open: boolean; 
  onClose: () => void; 
}) => {
  if (!file) return null;

  const isImage = file.mimeType?.startsWith('image/');
  const isVideo = file.mimeType?.startsWith('video/');
  const isAudio = file.mimeType?.startsWith('audio/');
  const isPdf = file.mimeType === 'application/pdf';

  const handleDownload = () => {
    if (file.url) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.originalName || file.filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (navigator.share && file.url) {
      try {
        await navigator.share({
          title: file.originalName || file.filename,
          url: file.url,
        });
      } catch (err) {
        // Fallback to clipboard
        navigator.clipboard.writeText(file.url);
      }
    } else if (file.url) {
      navigator.clipboard.writeText(file.url);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box>
          <Typography variant="h6" noWrap>
            {file.originalName || file.filename || '파일명 없음'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {file.mimeType} • {formatFileSize(file.size)}
          </Typography>
        </Box>
        <Box>
          <Stack direction="row" spacing={1}>
            {file.url && (
              <>
                <Tooltip title="다운로드">
                  <IconButton onClick={handleDownload} size="small">
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title="링크 복사">
                  <IconButton onClick={handleShare} size="small">
                    <Share />
                  </IconButton>
                </Tooltip>
              </>
            )}
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Stack>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 2 }}>
        {isImage && file.url && (
          <Box sx={{ textAlign: 'center' }}>
            <img
              src={file.url}
              alt={file.originalName || file.filename}
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </Box>
        )}
        {isVideo && file.url && (
          <Box sx={{ textAlign: 'center' }}>
            <video
              controls
              style={{
                maxWidth: '100%',
                maxHeight: '70vh',
                borderRadius: 8,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            >
              <source src={file.url} type={file.mimeType} />
              브라우저가 비디오를 지원하지 않습니다.
            </video>
          </Box>
        )}
        {isAudio && file.url && (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <AudioFile sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <audio
              controls
              style={{ width: '100%', maxWidth: '400px' }}
            >
              <source src={file.url} type={file.mimeType} />
              브라우저가 오디오를 지원하지 않습니다.
            </audio>
          </Box>
        )}
        {isPdf && file.url && (
          <Box sx={{ textAlign: 'center', height: '70vh' }}>
            <iframe
              src={file.url}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: 8
              }}
              title={file.originalName || file.filename}
            />
          </Box>
        )}
        {!isImage && !isVideo && !isAudio && !isPdf && (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            {getFileIcon(file.mimeType)}
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
              미리보기를 사용할 수 없습니다
            </Typography>
            <Typography variant="body2" color="text.secondary">
              이 파일 형식은 미리보기가 지원되지 않습니다.
            </Typography>
            {file.url && (
              <Box sx={{ mt: 2 }}>
                <Link href={file.url} target="_blank" rel="noopener noreferrer">
                  파일 다운로드
                </Link>
              </Box>
            )}
          </Box>
        )}
        
        {/* 파일 정보 */}
        <Box sx={{ 
          mt: 3, 
          p: 2, 
          backgroundColor: 'background.default', 
          borderRadius: 2 
        }}>
          <Typography variant="subtitle2" gutterBottom>
            파일 정보
          </Typography>
          <Stack spacing={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">크기:</Typography>
              <Typography variant="body2">{formatFileSize(file.size)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">유형:</Typography>
              <Typography variant="body2">{file.mimeType}</Typography>
            </Box>
            {file.uploadedBy && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">업로더:</Typography>
                <Typography variant="body2">
                  {file.uploadedBy?.username || file.uploadedBy}
                </Typography>
              </Box>
            )}
            {file.createdAt && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">업로드일:</Typography>
                <Typography variant="body2">
                  {new Date(file.createdAt).toLocaleString('ko-KR')}
                </Typography>
              </Box>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">공개 상태:</Typography>
              <Chip 
                label={file.isPublic ? '공개' : '비공개'} 
                color={file.isPublic ? 'success' : 'default'}
                size="small"
              />
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

// 테이블 컬럼 정의
const fileTableColumns = (onPreview: (file: any) => void): TableColumn[] => [
  {
    key: 'id',
    label: 'ID',
    width: '80px',
    minWidth: '60px',
    priority: 10,
    hideOnMobile: true,
  },
  {
    key: 'preview',
    label: '미리보기',
    width: '100px',
    minWidth: '80px',
    priority: 5,
    hideOnMobile: false,
    render: (value, record) => {
      const isImage = record.mimeType?.startsWith('image/');
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isImage && record.url ? (
            <Box
              sx={{
                position: 'relative',
                width: 48,
                height: 48,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: '2px solid',
                borderColor: 'divider',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'scale(1.05)',
                  transition: 'all 0.2s ease'
                }
              }}
              onClick={() => onPreview(record)}
            >
              <img
                src={record.url}
                alt={record.originalName || record.filename}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  '&:hover': {
                    opacity: 1,
                    transition: 'opacity 0.2s ease'
                  }
                }}
              >
                <Visibility sx={{ color: 'white', fontSize: 20 }} />
              </Box>
            </Box>
          ) : (
            <Tooltip title="미리보기">
              <IconButton 
                size="small" 
                onClick={() => onPreview(record)}
                sx={{
                  width: 48,
                  height: 48,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'primary.light'
                  }
                }}
              >
                {getFileIcon(record.mimeType)}
              </IconButton>
            </Tooltip>
          )}
        </Box>
      );
    }
  },
  {
    key: 'originalName',
    label: '파일명',
    flex: 1,
    minWidth: '200px',
    priority: 1, // 가장 높은 우선순위
    hideOnMobile: false,
    render: (value, record) => (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
          {getFileIcon(record.mimeType)}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              fontWeight: 500,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              cursor: record.url ? 'pointer' : 'default'
            }}
            onClick={() => record.url && onPreview(record)}
          >
            {value || record.filename || '파일명 없음'}
          </Typography>
          {record.url && (
            <Link 
              href={record.url} 
              target="_blank" 
              rel="noopener noreferrer"
              sx={{ 
                fontSize: '0.75rem',
                color: 'text.secondary',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
              onClick={(e) => e.stopPropagation()}
            >
              원본 링크
            </Link>
          )}
        </Box>
      </Box>
    )
  },
  {
    key: 'mimeType',
    label: '유형',
    width: '120px',
    minWidth: '100px',
    priority: 30,
    hideOnMobile: true,
    render: (value) => (
      <Chip 
        label={value?.split('/')[1] || '알 수 없음'} 
        size="small"
        variant="outlined"
      />
    )
  },
  {
    key: 'size',
    label: '크기',
    width: '100px',
    minWidth: '80px',
    align: 'right',
    priority: 2, // 높은 우선순위
    hideOnMobile: false,
    render: (value) => formatFileSize(value)
  },
  {
    key: 'isPublic',
    label: '공개',
    width: '80px',
    minWidth: '70px',
    align: 'center',
    priority: 20,
    hideOnMobile: false,
    render: (value) => (
      <Chip 
        label={value ? '공개' : '비공개'} 
        color={value ? 'success' : 'default'}
        size="small"
      />
    )
  },
  {
    key: 'uploadedBy',
    label: '업로더',
    width: '120px',
    minWidth: '100px',
    priority: 35,
    hideOnMobile: true,
    render: (value, record) => record.uploadedBy?.username || record.uploadedBy || '-'
  },
  {
    key: 'createdAt',
    label: '업로드일',
    width: '130px',
    minWidth: '110px',
    priority: 40,
    hideOnMobile: true,
    render: (value) => value ? new Date(value).toLocaleString('ko-KR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : '-'
  },
];

// 상단 툴바
const FileListActions = () => (
  <TopToolbar sx={{ 
    backgroundColor: 'transparent',
    boxShadow: 'none',
    '& .MuiButton-root': {
      borderRadius: 2,
      textTransform: 'none',
      fontWeight: 500
    }
  }}>
    <RefreshButton 
      sx={{ 
        mr: 1,
        '&:hover': {
          backgroundColor: 'action.hover'
        }
      }} 
    />
    <CreateButton 
      label="파일 업로드"
      sx={{ 
        mr: 1,
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        '&:hover': {
          backgroundColor: 'primary.dark'
        }
      }}
    />
    <ExportButton 
      sx={{
        borderColor: 'primary.main',
        color: 'primary.main',
        '&:hover': {
          backgroundColor: 'primary.light',
          borderColor: 'primary.dark'
        }
      }}
    />
  </TopToolbar>
);

// 전체 그룹 표시 컴포넌트
const AllGroupsDatagrid = () => {
  const listContext = useListContext();
  const { data: originalData, isPending } = listContext;
  const [previewFile, setPreviewFile] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handlePreview = (file: any) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
    setPreviewFile(null);
  };
  
  if (isPending) {
    return <div>로딩 중...</div>;
  }

  if (!originalData || originalData.length === 0) {
    return (
      <EmptyList
        title="등록된 파일이 없습니다"
        description="첫 번째 파일을 업로드해보세요"
        icon={<InsertDriveFile sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />}
        createButtonLabel="파일 업로드"
      />
    );
  }

  const groupedData = groupFilesByType(originalData);

  return (
    <Box>
      {groupedData.map((groupData) => (
        <GroupedTable
          key={groupData.groupKey}
          groupData={groupData}
          columns={fileTableColumns(handlePreview)}
          itemLabel="파일"
          enableBulkDelete={true}
          enableSelection={true}
          groupIcon={getFileIcon(groupData.items[0]?.mimeType || '')}
        />
      ))}
      
      <FilePreviewModal
        file={previewFile}
        open={previewOpen}
        onClose={handleClosePreview}
      />
    </Box>
  );
};

// 파일 리스트 컴포넌트
export const FilesList = () => (
  <List 
    actions={<FileListActions />}
    title="파일 관리"
    pagination={false}
    sx={{
      '& .RaList-main': {
        backgroundColor: 'background.default',
        minHeight: '100vh'
      }
    }}
  >
    <Box sx={{ p: 2 }}>
      <Card sx={{ 
        backgroundColor: 'background.paper',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: 2,
        overflow: 'hidden'
      }}>

        
        <AllGroupsDatagrid />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          p: 3,
          backgroundColor: 'background.paper',
          borderTop: '1px solid',
          borderTopColor: 'divider'
        }}>
          <Pagination />
        </Box>
      </Card>
    </Box>
  </List>
);

export default FilesList;