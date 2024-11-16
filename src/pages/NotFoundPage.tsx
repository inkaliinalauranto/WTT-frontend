import { Link } from "react-router-dom"
import { Layout } from "../assets/css/layout"


export default function NotFoundPage() {

    return <Layout>
        <h1>404 Page not found</h1>
        <Link to="/login">Go to LoginPage</Link>
    </Layout>
}
