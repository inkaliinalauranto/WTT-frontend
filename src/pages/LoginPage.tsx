import { Layout } from "../assets/css/layout";
import { GreenButton } from "../assets/css/button";
import { Textfield } from "../assets/css/textfield";
import { LoginForm } from "../assets/css/loginform";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { authStore } from "../store/authStore";
import { LoginReq } from "../models/auth";
import { useSnapshot } from "valtio";


export default function LoginPage() {

    const snap = useSnapshot(authStore)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const credentials:LoginReq = {
        username,
        password
    }

    const navigate = useNavigate()

    // Formissa on mahdollisuus laittaa napin tyypiksi submit
    // Kun submittia painetaan, käynnisttään formin onSubmit eventti
    // Joka kutsuu tätä funktiota.
    // Lähetetään requesti auth servicefunctiolle. 
    // Tämä on vähänniinkuin "viewmodel" tai "controller"
    // Periaatteesa koodia voisi refactoroida jonnekkin toisaalle, 
    // mutta navigate täytyy tehdä täällä.
    const onLogin = async (event: React.FormEvent) => {
        event.preventDefault()

        // Tehdään kysely
        try {
            await authStore.login(credentials)
            navigate("/")
            /*
            if (authStore.loggedIn) {
                if (authStore.authUser.roleName == "employee") {
                    navigate("/employee")
                }
                else if (authStore.authUser.roleName == "manager") {
                    navigate("/manager")
                }
            }*/
        } 
        catch (e:unknown) {
            if (e instanceof Error) {
                authStore.setError(e.message);
            } 
            else {
                authStore.setError("An unknown error occurred");
            }
        }
    }


    return <Layout>
        <h1>Worktime Tracker</h1>
        <LoginForm onSubmit={onLogin}>
            <Textfield required
                type="text" 
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Textfield required
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <GreenButton type="submit">
                {snap.isLoading ? <CircularProgress size={30} color={"inherit"} /> : 'Login'}
            </GreenButton>
            {snap.error != '' && <p>Error: {snap.error}</p>}
        </LoginForm>
    </Layout>
}
