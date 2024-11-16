import { subscribe, useSnapshot } from "valtio";
import { useEffect } from "react";
import { authStore } from "./store/authStore";
import { useNavigate } from "react-router-dom";


export default function Root() {
  const authSnap = useSnapshot(authStore)
  const navigate = useNavigate()


  useEffect(() => {

    authSnap.tryAutoLogin()

    subscribe(authStore, () => {

      if (authStore.isAuth) {
        navigate("/dashboard")
      } else {
        navigate("/login")
      }

    })
  }, [navigate])


  return <></>
}