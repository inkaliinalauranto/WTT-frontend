import { Link, useNavigate } from "react-router-dom";
import { Layout } from "../assets/css/layout";
import { theme } from "../assets/css/theme";
import { Button } from "../components/Button";
import { login } from "../services/auth";
import { CSSProperties, useState } from "react";
import { LoginReq } from "../models/auth";


export default function LoginPage() {
    const [_username, setUsername] = useState("");
    const [_password, setPassword] = useState("");
   
    const loginReq: LoginReq = {
        username: _username,
        password: _password
    }

    const navigate = useNavigate();

    function requestLogin() {
        const res = login(loginReq)
        res.then((res) => {
            // todo: tallenna res.access_token keksiin 

            switch (res.auth_user.role_id) {
                case 1:
                    navigate('employee', {replace:true})
                    return
                case 2:
                    navigate('manager', {replace:true})
                    return
                default:
                    return
            }
        })
    }

    const style: CSSProperties = {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    }
    
    return <Layout>
        {/* Dev navigation */}
        <div><Link to="/manager">Go to ManagerPage</Link></div>
        <div><Link to="/employee">Go to EmployeePage</Link></div>
        <div><Link to="/manager/inspect">Go to InspectEmployeePage</Link></div>
        
        <h1>Worktime Tracker</h1>
        <div style={style}>
            <input type="text" 
                value={_username} 
                onChange={(e) => setUsername(e.target.value)}
                />
            <input type="password" 
                value={_password} 
                onChange={(e) => setPassword(e.target.value)}
                />

            <Button 
                text="Kirjaudu sisään" 
                buttonColor={theme.green} 
                onclick={() => requestLogin()}
                />
        </div>
    </Layout>
}
