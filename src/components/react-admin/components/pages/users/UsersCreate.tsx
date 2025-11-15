"use client";

import { 
  Create, 
  SimpleForm, 
  TextInput,
  BooleanInput,
  SelectInput,
  required,
  email,
  minLength,
} from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';

export const UsersCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          새로운 사용자 계정을 생성합니다. 필수 항목은 반드시 입력해야 합니다.
        </Alert>

        <Typography variant="h6" sx={{ mt: 2, mb: 1, width: '100%' }}>
          필수 정보
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, width: '100%' }}>
          <TextInput 
            source="username" 
            label="사용자명" 
            validate={[required(), minLength(3)]}
            helperText="최소 3자 이상"
            fullWidth 
          />
          <TextInput 
            source="email" 
            label="이메일" 
            type="email" 
            validate={[required(), email()]}
            fullWidth 
          />
        </Box>
        
        <Box sx={{ width: '100%', mt: 1 }}>
          <TextInput 
            source="password" 
            label="비밀번호" 
            type="password" 
            validate={[required(), minLength(8)]}
            helperText="최소 8자 이상"
            fullWidth 
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, width: '100%' }}>
          개인 정보 (선택사항)
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, width: '100%' }}>
          <TextInput source="firstName" label="이름" fullWidth />
          <TextInput source="lastName" label="성" fullWidth />
          <TextInput source="phoneNumber" label="전화번호" fullWidth />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, width: '100%' }}>
          환경 설정
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, width: '100%' }}>
          <SelectInput 
            source="timezone" 
            label="시간대" 
            defaultValue="Asia/Seoul"
            choices={[
              { id: 'Asia/Seoul', name: '서울 (GMT+9)' },
              { id: 'UTC', name: 'UTC' },
              { id: 'America/New_York', name: '뉴욕 (EST)' },
              { id: 'Europe/London', name: '런던 (GMT)' },
            ]}
            fullWidth
          />
          <SelectInput 
            source="locale" 
            label="언어/지역" 
            defaultValue="ko-KR"
            choices={[
              { id: 'ko-KR', name: '한국어' },
              { id: 'en-US', name: 'English (US)' },
              { id: 'ja-JP', name: '日本語' },
            ]}
            fullWidth
          />
        </Box>

        <Typography variant="h6" sx={{ mt: 3, mb: 1, width: '100%' }}>
          계정 설정
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <BooleanInput source="isActive" label="계정 활성화" defaultValue={true} />
          <BooleanInput source="isVerified" label="이메일 인증 완료" defaultValue={false} />
        </Box>
      </SimpleForm>
    </Create>
  );
};
