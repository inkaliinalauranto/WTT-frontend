import { useEffect } from "react";
import { authStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";


// @ts-ignore
export default function ProtectedRoute({children}) {

    const snap = useSnapshot(authStore)
    const navigate = useNavigate()

    useEffect(() => {
        authStore.tryAutoLogin().catch(() => {
            console.log("ProtectedRoute - authstore logged in: " + snap.loggedIn)
            if (!authStore.loggedIn) {
                navigate("/login")
            } 
            else {
                console.log("yritetään kirjautua")
                authStore.tryAutoLogin()
            }
        })
      }, []);

    return <>
        {snap.isLoading? <p>Loading</p> : children}
    </>
}