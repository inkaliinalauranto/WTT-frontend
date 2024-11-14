import { Link } from "react-router-dom";
import { Layout } from "../assets/css/layout";
import { GreenButton } from "../assets/css/button";
import { Textfield } from "../assets/css/textfield";
import { LoginForm } from "../assets/css/loginform";
import { useState } from "react";
import { LoginReq } from "../models/auth";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth";
import Cookies from 'js-cookie';
import CircularProgress from '@mui/material/CircularProgress';


export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const req:LoginReq = {
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
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        // Loading cirle napille
        setIsLoading(true)
  
        // Tehdään kysely
        try {
            const res = await login(req)

            // Tallennetaan saatu keksi. Tämän voisi tehdä servicessäkin.
            Cookies.set('wtt-token', res.access_token, { expires: 7, secure: true });

            // Käsitellään response. Navigaten reacthookin takia tämän täytyy olla täällä
            if (res.auth_user.role_id == 1) {
                // Navigoidaan työntekijän dashboardiin
                // Replace tarkoittaa, että se ei laita stäkin päälle vaan korvaa sen.
                // Eli ei voi navigoida selaimen nuolesta taaksepäin takaisin loginpagelle.
                navigate('/employee', {replace: true})
            } 
            else if (res.auth_user.role_id == 2) {
                navigate('/manager', {replace: true})
            }
            else {
                throw new Error('Invalid role');
            }
        } 
        catch (e) {
            if (e instanceof Error) {
                console.error('Login Failed', e.message)
            }
             // Asetetaan loading pois päältä, jossei päästy toiselle sivulle.
            setIsLoading(false)
        }
    }

    return <Layout>
        {/* Dev navigation */}
        <Link to="/manager">Go to ManagerPage</Link>
        <Link to="/employee">Go to EmployeePage</Link>
        <Link to="/manager/inspect">Go to InspectEmployeePage</Link>
        
        <h1>Worktime Tracker</h1>
        <LoginForm onSubmit={handleSubmit}>
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
                {isLoading ? <CircularProgress size={30} color={"inherit"} /> : 'Login'}
            </GreenButton>
        </LoginForm>
    </Layout>
}
