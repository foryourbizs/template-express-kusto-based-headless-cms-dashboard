import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Divider,
  Card,
  CardContent,
  CardHeader,
  Stack,
} from '@mui/material';
import {
  Title,
  useNotify,
  Loading,
} from 'react-admin';
import {
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

/**
 * React Admin 방식의 환경설정 페이지
 * Title 컴포넌트를 사용하여 브라우저 타이틀 설정
 */
export const Settings: React.FC = () => {
  const notify = useNotify();
  const [loading, setLoading] = React.useState(false);
  
  // 설정 상태
  const [settings, setSettings] = React.useState({
    notifications: {
      email: true,
      push: false,
      sms: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    },
    appearance: {
      darkMode: false,
      language: 'ko',
    },
    system: {
      apiUrl: 'http://localhost:4000/api',
      maxUploadSize: 10,
    }
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // 실제로는 API 호출
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // localStorage에 설정 저장 (실제로는 서버에 저장)
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      notify('설정이 저장되었습니다.', { type: 'success' });
    } catch (error) {
      notify('설정 저장 중 오류가 발생했습니다.', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    // 기본 설정으로 리셋
    setSettings({
      notifications: {
        email: true,
        push: false,
        sms: true,
      },
      security: {
        twoFactor: false,
        sessionTimeout: 30,
      },
      appearance: {
        darkMode: false,
        language: 'ko',
      },
      system: {
        apiUrl: 'http://localhost:4000/api',
        maxUploadSize: 10,
      }
    });
    notify('설정이 초기화되었습니다.', { type: 'info' });
  };

  // React Admin의 Loading 컴포넌트 사용
  if (loading) {
    return <Loading />;
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* React Admin의 Title 컴포넌트로 페이지 타이틀 설정 */}
      <Title title="환경설정" />
      
      <Typography variant="h4" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <SettingsIcon sx={{ mr: 1 }} />
        환경설정
      </Typography>

      <Stack spacing={3}>
        {/* 알림 설정 */}
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader
                avatar={<NotificationsIcon />}
                title="알림 설정"
                subheader="알림 수신 방법을 설정합니다"
              />
              <CardContent>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: e.target.checked }
                        }))}
                      />
                    }
                    label="이메일 알림"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.push}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: e.target.checked }
                        }))}
                      />
                    }
                    label="푸시 알림"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.sms}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: e.target.checked }
                        }))}
                      />
                    }
                    label="SMS 알림"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>

          {/* 보안 설정 */}
          <Box sx={{ flex: 1 }}>
            <Card>
              <CardHeader
                avatar={<SecurityIcon />}
                title="보안 설정"
                subheader="계정 보안을 강화합니다"
              />
              <CardContent>
                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.security.twoFactor}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          security: { ...prev.security, twoFactor: e.target.checked }
                        }))}
                      />
                    }
                    label="2단계 인증"
                  />
                  <TextField
                    label="세션 만료 시간 (분)"
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      security: { ...prev.security, sessionTimeout: parseInt(e.target.value) }
                    }))}
                    fullWidth
                    size="small"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* 시스템 설정 */}
        <Card>
          <CardHeader
            avatar={<PaletteIcon />}
            title="시스템 설정"
            subheader="애플리케이션 기본 설정"
          />
          <CardContent>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', md: 'row' } }}>
              <TextField
                label="API 서버 URL"
                value={settings.system.apiUrl}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, apiUrl: e.target.value }
                }))}
                fullWidth
                size="small"
              />
              <TextField
                label="최대 업로드 크기 (MB)"
                type="number"
                value={settings.system.maxUploadSize}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  system: { ...prev.system, maxUploadSize: parseInt(e.target.value) }
                }))}
                fullWidth
                size="small"
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>

      {/* 액션 버튼 */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleReset}
          disabled={loading}
        >
          초기화
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? '저장 중...' : '저장'}
        </Button>
      </Box>
    </Box>
  );
};
