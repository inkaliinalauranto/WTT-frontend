import CircularProgress from "@mui/material/CircularProgress";
import { LoadingLayout } from "../assets/css/loadingLayout";


export default function LoadingComponent(){
    return <LoadingLayout><CircularProgress size={65} thickness={4}/></LoadingLayout>
}
  