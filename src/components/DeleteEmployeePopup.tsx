import { CircularProgress } from "@mui/material"
import { BlueButton, RedButton } from "../assets/css/button"
import { Popup } from "./Popup"
import { Row } from "../assets/css/row"
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import { DeleteEmployeePopupProps } from "../models/layout";

export function DeleteEmployeePopup(deleteEmployeeProps: DeleteEmployeePopupProps) {
    return (
        <Popup
        isOpen={deleteEmployeeProps.isOpen}
        onBackGroundClick={deleteEmployeeProps.close}
        title="Poista työntekijä"
    >
        <p>
            Oletko varma, että haluat poistaa pysyvästi <br></br> 
            työntekijän <strong>{deleteEmployeeProps.firstName} {deleteEmployeeProps.lastName}</strong>?
        </p>
        <Row>
            <BlueButton onClick={deleteEmployeeProps.close}>
                <UndoIcon/>&nbsp;Takaisin
            </BlueButton>
            {deleteEmployeeProps.isLoading ? 
                <RedButton disabled={true}><CircularProgress color={"inherit"} size={30}/></RedButton> 
                : <RedButton onClick={deleteEmployeeProps.deleteEmployee}><DeleteIcon/>&nbsp;Poista</RedButton>
            }
           
        </Row>   
    </Popup>
    )
}