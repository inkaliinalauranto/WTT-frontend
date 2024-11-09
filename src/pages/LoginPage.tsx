import { Link } from "react-router-dom";


export default function LoginPage() {

    return <>
        <h1>LoginPage</h1>
        

        {/* Dev navigation */}
        <div><Link to="/manager">Go to ManagerPage</Link></div>
        <div><Link to="/employee">Go to EmployeePage</Link></div>
        <div><Link to="/manager/inspect">Go to InspectEmployeePage</Link></div>
    </>
}
