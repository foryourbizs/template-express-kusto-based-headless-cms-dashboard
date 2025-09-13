import React from 'react';
import {
  Edit,
  SimpleForm,
  TextInput,
  required,
  minLength,
  maxLength,
  useEditContext,
  TopToolbar,
  ListButton,
  ShowButton,
  DeleteButton,
  SaveButton,
  Toolbar,
  useGetList,
} from 'react-admin';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  Group,
  Info,
  Key,
  Menu as MenuIcon,
  Warning,
} from '@mui/icons-material';

// 상단 액션 툴바
const EditActions = () => (
  <TopToolbar>
    <ListButton />
    <ShowButton />
    <DeleteButton
      confirmTitle="메뉴 그룹 삭제"
      confirmContent="이 메뉴 그룹을 삭제하시겠습니까? 그룹에 속한 모든 메뉴도 함께 삭제됩니다."
      mutationOptions={{
        onError: (error) => {
          console.error('Delete error:', error);
        }
      }}
    />
  </TopToolbar>
);

// 커스텀 툴바
const EditToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

// 그룹 기본 정보 섹션
const GroupInfoSection = () => {
  const { record } = useEditContext();
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Key color="primary" />
          <Typography variant="h6">그룹 식별자</Typography>
        </Box>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* 그룹 키는 수정 불가 */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              그룹 키
            </Typography>
            <Chip
              label={record?.key || '-'}
              variant="filled"
              color="primary"
              sx={{ fontSize: '0.9rem', height: 32 }}
            />
            <Alert severity="info" sx={{ mt: 1 }}>
              그룹 키는 시스템에서 메뉴를 참조하는데 사용되므로 수정할 수 없습니다.
            </Alert>
          </Box>
          
          <Divider />
          
          <TextInput
            source="name"
            label="그룹 이름"
            fullWidth
            validate={[required(), minLength(1), maxLength(100)]}
            helperText="사용자에게 표시될 그룹 이름을 입력하세요 (최대 100자)"
          />

          <TextInput
            source="description"
            label="설명"
            multiline
            rows={3}
            fullWidth
            validate={[maxLength(255)]}
            helperText="그룹에 대한 설명을 입력하세요 (최대 255자, 선택사항)"
          />
        </Box>
      </CardContent>
    </Card>
  );
};

// 연결된 메뉴 목록 섹션
const RelatedMenusSection = () => {
  const { record } = useEditContext();
  
  // 이 그룹에 속한 메뉴들을 조회
  const { data: menus, isPending, error } = useGetList('privates/siteMenu', {
    pagination: { page: 1, perPage: 100 },
    sort: { field: 'displayOrder', order: 'ASC' },
    filter: { groupKeyUuid: record?.uuid },
  });

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <MenuIcon color="primary" />
          <Typography variant="h6">연결된 메뉴</Typography>
          {menus && (
            <Chip
              label={`${menus.length}개`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        
        {isPending && (
          <Typography variant="body2" color="text.secondary">
            메뉴 목록을 불러오는 중...
          </Typography>
        )}
        
        {error && (
          <Alert severity="error">
            메뉴 목록을 불러오는 중 오류가 발생했습니다.
          </Alert>
        )}
        
        {menus && menus.length > 0 ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              이 그룹에 속한 메뉴들입니다. 그룹을 삭제하면 아래 메뉴들도 함께 삭제됩니다.
            </Typography>
            
            <List dense sx={{ bgcolor: 'background.paper', borderRadius: 1, border: 1, borderColor: 'divider' }}>
              {menus.map((menu, index) => (
                <React.Fragment key={menu.id || menu.uuid}>
                  <ListItem>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {menu.title}
                          </Typography>
                          {menu.parentUUID && (
                            <Chip label="하위 메뉴" size="small" variant="outlined" color="secondary" />
                          )}
                          <Chip 
                            label={menu.type || 'INTERNAL_LINK'} 
                            size="small" 
                            variant="outlined" 
                            color="default"
                            sx={{ fontSize: '0.7rem' }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            순서: {menu.displayOrder || 0}
                          </Typography>
                          {menu.description && (
                            <Typography variant="caption" display="block" color="text.secondary">
                              {menu.description}
                            </Typography>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < menus.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        ) : menus && menus.length === 0 ? (
          <Alert severity="info">
            이 그룹에 연결된 메뉴가 없습니다. 메뉴 관리에서 새 메뉴를 추가할 수 있습니다.
          </Alert>
        ) : null}
      </CardContent>
    </Card>
  );
};

// 주의사항 섹션
const WarningSection = () => {
  const { record } = useEditContext();
  
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Warning color="warning" />
          <Typography variant="h6">주의사항</Typography>
        </Box>
        
        <Alert severity="warning">
          <Typography variant="body2">
            <strong>메뉴 그룹 삭제 시 주의사항:</strong><br />
            • 그룹을 삭제하면 이 그룹에 속한 모든 메뉴가 함께 삭제됩니다<br />
            • 그룹 키는 시스템에서 참조되므로 삭제 전 프론트엔드 코드를 확인하세요<br />
            • 삭제된 그룹과 메뉴는 복구할 수 없습니다
          </Typography>
        </Alert>
        
        <Alert severity="info" sx={{ mt: 1 }}>
          <Typography variant="body2">
            <strong>그룹 키 "{record?.key}" 사용 현황:</strong><br />
            프론트엔드에서 이 키를 사용하여 메뉴를 렌더링하고 있는지 확인하세요.
          </Typography>
        </Alert>
      </CardContent>
    </Card>
  );
};

// 메뉴 그룹 편집 컴포넌트
export const SiteMenuGroupEdit = () => {
  return (
    <Edit
      actions={<EditActions />}
      title="메뉴 그룹 편집"
      mutationMode="pessimistic"
    >
      <SimpleForm toolbar={<EditToolbar />}>
        {/* 숨겨진 UUID 필드 */}
        <TextInput source="uuid" sx={{ display: 'none' }} />
        
        {/* 그룹 기본 정보 */}
        <GroupInfoSection />
        
        {/* 연결된 메뉴 목록 */}
        <RelatedMenusSection />
        
        {/* 주의사항 */}
        <WarningSection />
      </SimpleForm>
    </Edit>
  );
};

export default SiteMenuGroupEdit;
