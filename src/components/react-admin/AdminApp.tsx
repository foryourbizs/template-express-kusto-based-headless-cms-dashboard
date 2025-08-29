"use client"; // remove this line if you choose Pages Router




import {
  Resource,
  ListGuesser,
  EditGuesser,
  Admin,
  CustomRoutes
} from "react-admin";
import { BrowserRouter } from "react-router-dom";
import {
  People,
  ViewList,
  Article,
  Settings,
  Analytics,
} from '@mui/icons-material';

import { dataProvider } from "./lib/dataProvider";
import authProvider from "./lib/authProvider";
import LoginPage from "./components/LoginPage";
import { simpleGrayTheme } from "./config/theme";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import { Settings as SettingsPage } from "./components/pages/SettingsSimple";
import { SystemMenuList } from "./components/resources/MenuRedirects";
import { Analytics as AnalyticsPage, SystemLogs } from "./components/pages/SystemPages";
import { UserSessionList } from "./components/guesser/UserSessionList";
import { UserList } from "./components/guesser/UserList";





const AdminApp = () => (
  <BrowserRouter>
    <Admin
      dataProvider={dataProvider}
      authProvider={authProvider}
      theme={simpleGrayTheme}
      loginPage={LoginPage}
      layout={Layout}
      dashboard={Dashboard}
    >


      <Resource
        name="privates/users"
        list={UserList}
        edit={EditGuesser}
        options={{ 
          label: '사용자',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <People />
        }}
      />

      <Resource
        name="privates/users/user-sessions"
        list={UserSessionList}
        options={{ 
          label: '세션',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <ViewList />
        }}
      />
      <Resource
        name="privates/users/roles"
        list={ListGuesser}
        options={{ 
          label: '규칙',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
        
      />

      <Resource
        name="privates/users/permissions"
        list={ListGuesser}
        options={{ 
          label: '권한',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
      />

      <Resource
        name="privates/users/ratelimits"
        list={ListGuesser}
        options={{ 
          label: '레이트 리밋',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
      />

      <Resource
        name="privates/users/audits"
        list={ListGuesser}
        options={{ 
          label: '사용자 로그',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
      />




      {/* posts와 comments는 서버에 없으므로 제거 */}

      {/* 가상 Resource - 환경설정 페이지 (데이터 없음, 메뉴만 생성) */}
      <Resource
        name="system.settings"
        list={SettingsPage}
        options={{
          label: '환경설정',
          menuGroup: 'system',
          menuGroupLabel: '시스템',
          icon: <Settings />
        }}
      />

      {/* 가상 Resource - 분석 페이지 */}
      <Resource
        name="system.analytics"
        list={AnalyticsPage}
        options={{
          label: '데이터 분석',
          menuGroup: 'system',
          menuGroupLabel: '시스템',
          icon: <Analytics />
        }}
      />

      {/* 가상 Resource - 시스템 로그 페이지 */}
      <Resource
        name="system.logs"
        list={SystemLogs}
        options={{
          label: '시스템 로그',
          menuGroup: 'system',
          menuGroupLabel: '시스템',
          icon: <ViewList />
        }}
      />

      {/* 커스텀 라우트는 이제 필요 없음 - Resource로 자동 처리 */}

    </Admin>
  </BrowserRouter>
);





export default AdminApp;