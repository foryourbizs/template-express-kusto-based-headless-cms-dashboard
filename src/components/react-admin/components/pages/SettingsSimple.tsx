import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Chip,
} from '@mui/material';
import {
  Title,
  useNotify,
  TopToolbar,
} from 'react-admin';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

/**
 * React Admin 환경설정 페이지 (단순한 버전)
 * List 컴포넌트로 등록되어 자동 라우팅
 */
export const Settings: React.FC = () => {
  const notify = useNotify();
  const [loading, setLoading] = React.useState(false);
  
  // 로컬 상태로 설정 관리
  const [emailNotification, setEmailNotification] = React.useState(true);
  const [pushNotification, setPushNotification] = React.useState(false);
  const [twoFactor, setTwoFactor] = React.useState(false);
  const [apiUrl, setApiUrl] = React.useState('http://localhost:4000/api');

  const handleSave = async () => {
    setLoading(true);
    try {
      // 설정을 localStorage에 저장 (실제로는 API 호출)
      const settings = {
        emailNotification,
        pushNotification,
        twoFactor,
        apiUrl,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      // 잠시 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 800));
      
      notify('설정이 성공적으로 저장되었습니다.', { type: 'success' });
    } catch (error) {
      notify('설정 저장 중 오류가 발생했습니다.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmailNotification(true);
    setPushNotification(false);
    setTwoFactor(false);
    setApiUrl('http://localhost:4000/api');
    notify('설정이 초기화되었습니다.', { type: 'info' });
  };

  return (
    <Box>
      <Title title="환경설정" />
      
      <TopToolbar>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
          startIcon={<SettingsIcon />}
        >
          {loading ? '저장 중...' : '설정 저장'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={loading}
          sx={{ ml: 1 }}
        >
          초기화
        </Button>
      </TopToolbar>
      
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SettingsIcon sx={{ mr: 1 }} />
          시스템 환경설정
        </Typography>

        <Stack spacing={3}>
          {/* 알림 설정 */}
          <Card>
            <CardHeader
              avatar={<NotificationsIcon color="primary" />}
              title="알림 설정"
              subheader="시스템 알림 수신 방법을 설정합니다"
              action={<Chip label="기본 설정" size="small" variant="outlined" />}
            />
            <CardContent>
              <Stack spacing={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={emailNotification}
                      onChange={(e) => setEmailNotification(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="이메일 알림 수신"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={pushNotification}
                      onChange={(e) => setPushNotification(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="브라우저 푸시 알림"
                />
              </Stack>
            </CardContent>
          </Card>

          {/* 보안 설정 */}
          <Card>
            <CardHeader
              avatar={<SecurityIcon color="secondary" />}
              title="보안 설정"
              subheader="계정 보안을 강화합니다"
              action={<Chip label="권장" size="small" color="secondary" />}
            />
            <CardContent>
              <FormControlLabel
                control={
                  <Switch
                    checked={twoFactor}
                    onChange={(e) => setTwoFactor(e.target.checked)}
                    color="secondary"
                  />
                }
                label="2단계 인증 활성화"
              />
            </CardContent>
          </Card>

          {/* 시스템 설정 */}
          <Card>
            <CardHeader
              avatar={<StorageIcon color="info" />}
              title="시스템 설정"
              subheader="API 서버 및 시스템 기본 설정"
            />
            <CardContent>
              <TextField
                label="API 서버 URL"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                fullWidth
                variant="outlined"
                helperText="React Admin이 연결할 백엔드 API 서버 주소"
              />
            </CardContent>
          </Card>

          {/* 현재 설정 상태 */}
          <Card>
            <CardHeader
              title="현재 설정 상태"
              subheader="적용된 설정을 확인합니다"
            />
            <CardContent>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip 
                  label={`이메일 알림: ${emailNotification ? 'ON' : 'OFF'}`}
                  color={emailNotification ? 'success' : 'default'}
                  size="small"
                />
                <Chip 
                  label={`푸시 알림: ${pushNotification ? 'ON' : 'OFF'}`}
                  color={pushNotification ? 'success' : 'default'}
                  size="small"
                />
                <Chip 
                  label={`2단계 인증: ${twoFactor ? 'ON' : 'OFF'}`}
                  color={twoFactor ? 'warning' : 'default'}
                  size="small"
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
};
