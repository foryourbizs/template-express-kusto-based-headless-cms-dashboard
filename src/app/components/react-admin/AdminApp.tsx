"use client"; // remove this line if you choose Pages Router




import {
  radiantLightTheme,
  Resource,
  ListGuesser,
  EditGuesser,
  Admin
} from "react-admin";
import { HashRouter } from 'react-router-dom';

import { dataProvider } from "./lib/dataProvider";
import authProvider from "./lib/authProvider";
import CustomLoginPage from "./components/CustomLoginPage";





const AdminApp = () => (
  <HashRouter>
    <Admin 
      dataProvider={dataProvider} 
      authProvider={authProvider} 
      theme={radiantLightTheme}
      loginPage={CustomLoginPage}
    >

      <Resource
        name="users"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="name"
      />

      <Resource
        name="posts"
        list={ListGuesser}
        edit={EditGuesser}
        recordRepresentation="title"
      />

      <Resource name="comments" list={ListGuesser} edit={EditGuesser} />

    </Admin>
  </HashRouter>

);





export default AdminApp;