import { Link } from "react-router-dom"
import { Layout } from "../assets/css/layout"
import { BlueButton } from "../assets/css/button"


export default function NotFoundPage() {

    return <Layout>
        <h1>404 Page not found</h1>
        <Link to="/login"><BlueButton>Return</BlueButton></Link>
    </Layout>
}
