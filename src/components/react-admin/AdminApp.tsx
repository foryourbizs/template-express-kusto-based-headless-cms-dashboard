"use client"; // remove this line if you choose Pages Router




import {
  Resource,
  ListGuesser,
  EditGuesser,
  Admin,
  CustomRoutes
} from "react-admin";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router-dom";

import { dataProvider } from "./lib/dataProvider";
import authProvider from "./lib/authProvider";
import LoginPage from "./components/LoginPage";
import { simpleGrayTheme } from "./config/theme";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import { Settings } from "./components/pages/SettingsSimple";
import { SystemMenuList } from "./components/resources/MenuRedirects";
import { Analytics, SystemLogs } from "./components/pages/SystemPages";





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
      name="users"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="name"
      options={{ label: '사용자' }}
    />

    <Resource
      name="posts"
      list={ListGuesser}
      edit={EditGuesser}
      recordRepresentation="title"
      options={{ label: '게시물' }}
    />

    <Resource 
      name="comments" 
      list={ListGuesser} 
      edit={EditGuesser} 
      options={{ label: '댓글' }}
    />

    {/* 가상 Resource - 환경설정 페이지 (데이터 없음, 메뉴만 생성) */}
    <Resource
      name="system.settings"
      list={Settings}
      options={{ 
        label: '환경설정',
      }}
    />

    {/* 가상 Resource - 분석 페이지 */}
    <Resource
      name="system.analytics"
      list={Analytics}
      options={{ 
        label: '데이터 분석',
      }}
    />

    {/* 가상 Resource - 시스템 로그 페이지 */}
    <Resource
      name="system.logs"
      list={SystemLogs}
      options={{ 
        label: '시스템 로그',
      }}
    />

    {/* 커스텀 라우트는 이제 필요 없음 - Resource로 자동 처리 */}

    </Admin>
  </BrowserRouter>
);





export default AdminApp;