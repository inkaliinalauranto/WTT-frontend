import { useSnapshot } from "valtio";
import { authStore } from "../store/authStore";
import { Layout } from "../assets/css/layout";
import EmployeePage from "./EmployeePage";
import ManagerPage from "./ManagerPage";
import { AccountTopBar } from "../assets/css/accounttopbar";
import { RedButton } from "../assets/css/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CircularProgress } from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';


export default function Dashboard() {

  const [isLoading, setLoading] = useState(false)

  const snap = useSnapshot(authStore)
  const firstName = snap.authUser.firstName
  const lastName = snap.authUser.lastName
  const orgName = snap.authUser.orgName
  const navigate = useNavigate()

  async function logoutClick() {
    try {
        setLoading(true)
        await authStore.logout()
        navigate("/login")
    }
    catch (e:unknown) {
        if (e instanceof Error) {
            authStore.setError(e.message);
        } 
        else {
            authStore.setError("An unknown error occurred");
        }
    }
    setLoading(false)
  }

  return <Layout>
    <AccountTopBar>
      <div>
        <p>{firstName} {lastName}</p>
        <p>{orgName}</p>
        </div>
        {isLoading ? 
          <RedButton disabled={true}><CircularProgress color={"inherit"} size={30}/></RedButton> 
          : <RedButton onClick={logoutClick}><LogoutIcon/>&nbsp;Kirjaudu ulos</RedButton>
        }
    </AccountTopBar>
    {snap.authUser.roleName == "employee"? <EmployeePage/> : null}
    {snap.authUser.roleName == "manager"? <ManagerPage/> : null}
  </Layout>
}