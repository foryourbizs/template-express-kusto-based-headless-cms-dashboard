import React from 'react';
import { List, Datagrid, TextField, useRedirect } from 'react-admin';

/**
 * 시스템 관리 메뉴들의 더미 리스트 컴포넌트
 * 실제 데이터는 없지만 메뉴 구성을 위해 사용
 */
export const SystemMenuList: React.FC = () => {
  const redirect = useRedirect();

  React.useEffect(() => {
    // 이 컴포넌트가 로드되면 바로 환경설정으로 리다이렉트
    redirect('/settings');
  }, [redirect]);

  // 로딩 중 표시할 내용 (실제로는 바로 리다이렉트되므로 보이지 않음)
  return null;
};

/**
 * 분석 메뉴들의 더미 리스트 컴포넌트
 */
export const AnalyticsMenuList: React.FC = () => {
  const redirect = useRedirect();

  React.useEffect(() => {
    // 분석 페이지로 리다이렉트 (아직 만들지 않았으므로 설정으로)
    redirect('/settings');
  }, [redirect]);

  return null;
};
