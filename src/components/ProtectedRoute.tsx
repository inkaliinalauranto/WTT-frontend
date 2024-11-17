import { useEffect } from "react";
import { authStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { Layout } from "../assets/css/layout";
import { CircularProgress } from "@mui/material";

// Tämä ei jostain sysytä toimi vielä, pitää selvitellä

// @ts-ignore
export default function ProtectedRoute({children}) {
    const snap = useSnapshot(authStore)
    const navigate = useNavigate()


    useEffect(() => {
        authStore.tryAutoLogin().catch(()=> {
            if (!authStore.loggedIn) {
              navigate("/login")
            } 
          })
      }, [navigate]);


    return <>
        {snap.isLoading? <Layout><CircularProgress size={200} color={"inherit"}/></Layout> : children}
    </>
}