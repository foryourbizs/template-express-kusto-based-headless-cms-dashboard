"use client";

import { 
  Edit, 
  TabbedForm,
  FormTab,
  TextInput,
  BooleanInput,
  SelectInput,
  required,
  email,
} from 'react-admin';
import { Box } from '@mui/material';

export const UsersEdit = () => {
  return (
    <Edit>
      <TabbedForm>
        {/* 기본 정보 탭 */}
        <FormTab label="기본 정보">
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, width: '100%' }}>
            <TextInput source="username" label="사용자명" validate={required()} fullWidth />
            <TextInput source="email" label="이메일" type="email" validate={[required(), email()]} fullWidth />
            <TextInput source="firstName" label="이름" fullWidth />
            <TextInput source="lastName" label="성" fullWidth />
            <TextInput source="phoneNumber" label="전화번호" fullWidth />
            <SelectInput 
              source="timezone" 
              label="시간대" 
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
              choices={[
                { id: 'ko-KR', name: '한국어' },
                { id: 'en-US', name: 'English (US)' },
                { id: 'ja-JP', name: '日本語' },
              ]}
              fullWidth
            />
          </Box>
        </FormTab>

        {/* 계정 상태 탭 */}
        <FormTab label="계정 상태">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <BooleanInput source="isActive" label="계정 활성화" />
            <BooleanInput source="isVerified" label="이메일 인증 완료" />
            <BooleanInput source="isSuspended" label="계정 정지" />
          </Box>
        </FormTab>

        {/* 보안 설정 탭 */}
        <FormTab label="보안 설정">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <BooleanInput source="twoFactorEnabled" label="2단계 인증 활성화" />
            <TextInput 
              source="loginAttempts" 
              label="로그인 시도 횟수" 
              type="number"
              disabled
              helperText="자동으로 관리됩니다"
            />
          </Box>
        </FormTab>
      </TabbedForm>
    </Edit>
  );
};
