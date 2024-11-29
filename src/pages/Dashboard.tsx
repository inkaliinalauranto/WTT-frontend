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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { theme } from "../assets/css/theme";
import useWindowDimensions from "../hooks/windowDimensions";
import { ResponsiveSettings } from "../assets/css/responsive";
import { RightAligned } from "../assets/css/DayWeekSwitcher";


export default function Dashboard() {

  const [isLoading, setLoading] = useState(false)
  const { width } = useWindowDimensions();

  const snap = useSnapshot(authStore)
  const firstName = snap.authUser.firstName
  const lastName = snap.authUser.lastName
  const orgName = snap.authUser.orgName
  const teamName = snap.authUser.teamName
  const navigate = useNavigate()

  async function logoutClick() {
    try {
        setLoading(true)
        await authStore.logout()
        navigate("/login", {replace: true})
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
      <div style={{display: "flex",flexDirection: "row", gap: "10px"}}>
          { /* Responsiivisuuden takia ei näytetä avataria tilan säästämiseksi */
          width <= parseInt(ResponsiveSettings.smallScreenMaxWidth.replace("px", ""),10)
          ? null 
          : <AccountCircleIcon style={{transform: "scale(3)", margin: "20px"}} htmlColor={theme.gray25}/>
          }
          
          <div style={{display: "flex", flexDirection: "column"}}>
            <h1>{firstName} {lastName}</h1>
            <p>{orgName}</p>
            <p>{teamName}</p>
          </div>
        </div>
      <RightAligned>
        {isLoading ? 
          <RedButton disabled={true}><CircularProgress color={"inherit"} size={30}/></RedButton> 
          : <RedButton onClick={logoutClick}><LogoutIcon/>&nbsp;Kirjaudu ulos</RedButton>
        }
      </RightAligned>
    </AccountTopBar>
    {snap.authUser.roleName == "employee"? <EmployeePage/> : null}
    {snap.authUser.roleName == "manager"? <ManagerPage/> : null}
  </Layout>
}