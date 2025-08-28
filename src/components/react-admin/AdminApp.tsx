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
import { Settings } from "./components/pages/Settings";
import { SystemMenuList } from "./components/resources/MenuRedirects";





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

    {/* 커스텀 라우트 - 리소스가 아닌 별도 페이지들 */}
    <CustomRoutes>
      <Route path="/settings" element={<Settings />} />
    </CustomRoutes>

    </Admin>
  </BrowserRouter>
);





export default AdminApp;