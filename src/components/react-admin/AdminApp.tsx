"use client"; // remove this line if you choose Pages Router




import {
  Resource,
  ListGuesser,
  EditGuesser,
  Admin,
  CustomRoutes
} from "react-admin";

import ListGuesserEx from './components/guesser/ListGuesser';
import ObjectStoragesList from './components/guesser/ObjectStoragesList';
import ObjectStoragesEdit from './components/guesser/ObjectStoragesEdit';
import ObjectStoragesCreate from './components/guesser/ObjectStoragesCreate';
import FilesList from './components/guesser/FilesList';
import FilesEdit from './components/guesser/FilesEdit';
import FilesCreate from './components/guesser/FilesCreate';

import { BrowserRouter } from "react-router-dom";
import {
  People,
  ViewList,
  Article,
  Settings,
  Analytics,
  Storage,
  AttachFile,
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

import { CreateUserPermissions } from "./components/guesser/CreateUserPermissions";
import { PermissionsListWithDelete, } from "./components/guesser/PermissionsList";





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
        list={ListGuesserEx}
        options={{ 
          label: '역할',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          BulkDeleteButton: false,
          icon: <Article />
        }}
      />

      <Resource
        name="privates/users/permissions"
        list={PermissionsListWithDelete}
        create={CreateUserPermissions}
        options={{ 
          label: '권한',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
      />

      <Resource
        name="privates/users/ratelimits"
        list={ListGuesserEx}
        options={{ 
          label: '처리율 제한 장치',
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


      <Resource
        name="privates/users/user-roles"
        list={ListGuesserEx}
        options={{ 
          label: '역할 - 사용자 연결',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
      />

      <Resource
        name="privates/users/user-permissions"
        list={ListGuesserEx}
        options={{ 
          label: '권한 - 사용자 연결',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
      />

      <Resource
        name="privates/users/user-security-events"
        list={ListGuesserEx}
        options={{ 
          label: '사용자 보안 이벤트',
          menuGroup: 'users',
          menuGroupLabel: '사용자 관리',
          icon: <Article />
        }}
      />







      <Resource
        name="privates/objectStorages"
        list={ObjectStoragesList}
        edit={ObjectStoragesEdit}
        create={ObjectStoragesCreate}
        options={{ 
          label: '저장소',
          menuGroup: 'objects',
          menuGroupLabel: '오브젝트',
          icon: <Storage />
        }}
      />
      
      <Resource
        name="privates/files"
        list={FilesList}
        edit={FilesEdit}
        create={FilesCreate}
        options={{ 
          label: '파일',
          menuGroup: 'objects',
          menuGroupLabel: '오브젝트',
          icon: <AttachFile />
        }}
      />

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
    </Admin>
  </BrowserRouter>
);





export default AdminApp;