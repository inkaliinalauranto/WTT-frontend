import { BlueButton, RedButton } from "../assets/css/button";
import { Row } from "../assets/css/row";
import { Popup } from "./Popup";
import DeleteIcon from '@mui/icons-material/Delete';
import { CircularProgress } from '@mui/material';
import UndoIcon from '@mui/icons-material/Undo';
import { DeleteShiftPopupProps } from "../models/layout";

export function DeleteShiftPopup(deleteShiftProps: DeleteShiftPopupProps) {
    return (
        <Popup
        isOpen={deleteShiftProps.deleteConfirm}
        onBackGroundClick={deleteShiftProps.close}
        title="Poista vuoro"
    >
        <p>Oletko varma että haluat poistaa tämän vuoron?</p>
        <Row>
            <BlueButton onClick={deleteShiftProps.close}>
                <UndoIcon />&nbsp;Takaisin
            </BlueButton>
            {deleteShiftProps.isLoading ?
                <RedButton disabled={true}><CircularProgress color={"inherit"} size={30} /></RedButton>
                : <RedButton onClick={deleteShiftProps.handleRemove}><DeleteIcon />&nbsp;Poista</RedButton>
            }
        </Row>
    </Popup>
    )
}