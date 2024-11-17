import { useSnapshot } from "valtio";
import { authStore } from "../store/authStore";
import { Layout } from "../assets/css/layout";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmployeePage from "./EmployeePage";
import ManagerPage from "./ManagerPage";


export default function Dashboard() {
  const snap = useSnapshot(authStore)
  const navigate = useNavigate()

  console.log("Dashboard - authstore logged in: " + snap.loggedIn)

  useEffect(() => {
    if (!snap.loggedIn) {
      navigate("/login")
    } 
  }, [])


  return <Layout>
    <h1>Dashboard</h1>
    <p>Tähän rendataan topbar, jossa on käyttäjän nimi ja uloskirjautumisnappula</p>
    <p>Tähän rendataan</p>
    {snap.authUser.roleName == "employee"? <EmployeePage/> : null}
    {snap.authUser.roleName == "manager"? <ManagerPage/> : null}
  </Layout>
}