"use client"; // remove this line if you choose Pages Router




import {
  Resource,
  ListGuesser,
  EditGuesser,
  Admin
} from "react-admin";
import { BrowserRouter } from "react-router-dom";

import { dataProvider } from "./lib/dataProvider";
import authProvider from "./lib/authProvider";
import LoginPage from "./components/LoginPage";
import { simpleGrayTheme } from "./config/theme";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";





const AdminApp = () => (
  <BrowserRouter basename="/admin">
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

    </Admin>
  </BrowserRouter>
);





export default AdminApp;