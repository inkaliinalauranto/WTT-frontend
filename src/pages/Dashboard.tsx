import { useSnapshot } from "valtio";
import { authStore } from "../store/authStore";
import { Layout } from "../assets/css/layout";
import EmployeePage from "./EmployeePage";
import ManagerPage from "./ManagerPage";
import { AccountTopBar } from "../assets/css/accounttopbar";
import { RedButton } from "../assets/css/button";


export default function Dashboard() {
  const snap = useSnapshot(authStore)
  const firstName = snap.authUser.firstName
  const lastName = snap.authUser.lastName

  return <Layout>
    <AccountTopBar>
      <div>{firstName} {lastName}</div>
      <RedButton onClick={authStore.logout}>Kirjaudu Ulos</RedButton>
    </AccountTopBar>
    {snap.authUser.roleName == "employee"? <EmployeePage/> : null}
    {snap.authUser.roleName == "manager"? <ManagerPage/> : null}
  </Layout>
}