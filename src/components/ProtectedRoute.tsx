import { useEffect } from "react";
import { authStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { Layout } from "../assets/css/layout";
import { CircularProgress } from "@mui/material";


// @ts-ignore
export default function ProtectedRoute({children}) {
    const snap = useSnapshot(authStore)
    const navigate = useNavigate()

    // Suoritetaan autologin, jos siellä tulee joku error, navigoidaan kirjautumissivulle.
    useEffect(() => {
        authStore.account().then(()=> {
            if (!authStore.loggedIn) {
                console.log("kirjautuminen fail")
                navigate("/login")
            } 
        })
      }, [navigate]);


    return <>
        {snap.isLoading? <Layout><CircularProgress size={200} color={"inherit"}/></Layout> : children}
    </>
}