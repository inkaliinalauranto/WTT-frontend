import { Link } from "react-router-dom";
import { Layout } from "../assets/css/layout";
import { GreenButton } from "../assets/css/button";
import { Textfield } from "../assets/css/textfield";
import { LoginForm } from "../assets/css/loginform";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CircularProgress from '@mui/material/CircularProgress';
import { authStore } from "../store/authStore";
import { LoginReq } from "../models/auth";
import { getRole } from "../services/roles";
import { Role } from "../models/roles";
import { getAccount } from "../services/auth";
import { useSnapshot } from "valtio";


export default function LoginPage() {

    const snap = useSnapshot(authStore)
    const [isLoading, setIsLoading] = useState(false)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

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

        // Loading cirle napille
        setIsLoading(true)
  
        // Tehdään kysely
        try {
            await snap.login(credentials)
            const roleRes: Role = await getRole(snap.authUser.roleId)

            // Käsitellään response
            if (roleRes.name == "employee") {
                // Navigoidaan työntekijän dashboardiin
                // Replace tarkoittaa, että se ei laita stäkin päälle vaan korvaa sen.
                // Eli ei voi navigoida selaimen nuolesta taaksepäin takaisin loginpagelle.
                navigate('/employee')
            } 
            else if (roleRes.name == "manager") {
                navigate('/manager')
            }
            else {
                throw new Error('Unauthorized access');
            }
        } 
        catch (e) {
            if (e instanceof Error) {
                setError(e.message)
            }
             // Asetetaan loading pois päältä, jossei päästy toiselle sivulle.
            setIsLoading(false)
        }
    }

    async function getAcc() {
        const user = await getAccount()
        console.log(user)
    }


    return <Layout>
        
        {/* Dev navigation */}
        <Link to="/manager">Go to ManagerPage</Link>
        <Link to="/employee">Go to EmployeePage</Link>
        <Link to="/manager/inspect">Go to InspectEmployeePage</Link>
        <button onClick={getAcc}></button>
        
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
                {isLoading ? <CircularProgress size={30} color={"inherit"} /> : 'Login'}
            </GreenButton>
            {error != '' && <p>Error: {error}</p>}
        </LoginForm>
    </Layout>
}
