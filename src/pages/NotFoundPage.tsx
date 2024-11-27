import { useNavigate } from "react-router-dom"
import { Layout, Spacer } from "../assets/css/layout"
import { BlueButton } from "../assets/css/button"
import { AccountTopBar } from "../assets/css/accounttopbar"
import UndoIcon from '@mui/icons-material/Undo';



export default function NotFoundPage() {
  
    const navigate = useNavigate()

    function goBack() {
        navigate(-1)
    }

    return <Layout>
        <AccountTopBar>
            <BlueButton onClick={goBack}><UndoIcon/>&nbsp;Takaisin</BlueButton>
        </AccountTopBar>
        <Spacer height={30}/>
        <h1>404 Page not found</h1>
    </Layout>
}
