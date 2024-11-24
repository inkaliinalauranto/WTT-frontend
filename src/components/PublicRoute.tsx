import { useEffect } from "react";
import { authStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import { useSnapshot } from "valtio";
import { Layout } from "../assets/css/layout";
import LoadingComponent from "./LoadingComponent";


// @ts-ignore
export default function PublicRoute({children}) {
    const snap = useSnapshot(authStore)
    const navigate = useNavigate()

    // Jos käyttäjä on kirjautunut sisään, ohjataan takaisin dashboardiin.
    useEffect(() => {
        authStore.account().then(()=> {
            if (authStore.loggedIn) {
                navigate("/")
            } 
        })
      }, [navigate, authStore]);


    return <>
        {snap.isLoading? <Layout><LoadingComponent/></Layout> : children}
    </>
}