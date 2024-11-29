import { Layout, Spacer } from "../assets/css/layout";
import { GreenButton } from "../assets/css/button";
import { Textfield } from "../assets/css/textfield";
import { Form } from "../assets/css/form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { authStore } from "../store/authStore";
import { LoginReq } from "../models/auth";
import { useSnapshot } from "valtio";
import LoginIcon from '@mui/icons-material/Login';
import useWindowDimensions from "../hooks/windowDimensions";
import { ResponsiveSettings } from "../assets/css/responsive";


export default function LoginPage() {

    const { width } = useWindowDimensions();

    const snap = useSnapshot(authStore)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isLoading, setLoading] = useState(false)

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
            setLoading(true)
            await authStore.login(credentials)
            navigate("/", {replace: true})
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
    const loginBtn = <GreenButton type="submit"><LoginIcon/>&nbsp;Kirjaudu sisään</GreenButton>
    const loadingBtn = <GreenButton disabled={true}><CircularProgress color={"inherit"} size={30}/></GreenButton>


    return <Layout>
        <img 
            style={
                {maxWidth: width <= parseInt(ResponsiveSettings.smallScreenMaxWidth.replace("px", ""),10)
                ? "300px" 
                : "400px"}
            } 
            src = "./src/assets/svg/logo.svg" alt="Worktime Tracker"
        />
        <Spacer height={20}/>
        <Form onSubmit={onLogin}>
            <Textfield required
                type="text" 
                placeholder="käyttäjänimi"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <Textfield required
                type="password"
                placeholder="salasana"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <Spacer height={20}/>
        
            {isLoading? loadingBtn : loginBtn}

            {snap.error != '' && <p>Error: {snap.error}</p>}
        </Form>
    </Layout>
}
