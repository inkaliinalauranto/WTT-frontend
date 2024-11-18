import { useSnapshot } from "valtio";
import { authStore } from "../store/authStore";
import { Layout } from "../assets/css/layout";
import EmployeePage from "./EmployeePage";
import ManagerPage from "./ManagerPage";
import { AccountTopBar } from "../assets/css/accounttopbar";


export default function Dashboard() {
  const snap = useSnapshot(authStore)

  return <Layout>
    <AccountTopBar>Tähän rendataan topbar, jossa on käyttäjän nimi ja uloskirjautumisnappula. 
      Tämä paikka löytyy Dashboard.tsx &nbsp; &nbsp; &nbsp;&nbsp; &nbsp;
      Tän alapuolelle rendataan sitten kirjautuneen käyttäjän roolinmukainen page</AccountTopBar>
    {snap.authUser.roleName == "employee"? <EmployeePage/> : null}
    {snap.authUser.roleName == "manager"? <ManagerPage/> : null}
  </Layout>
}