import { BlueButton } from "../assets/css/button"
import { InspectShiftFirstP, InspectShiftP, InspectShiftSubtitle } from "../assets/css/popup";
import { InspectPopupProps } from "../models/layout";
import { Popup } from "./Popup"
import UndoIcon from '@mui/icons-material/Undo';

export function InspectShiftPopup({ showPopup, handleCancel, workDateStart, workDateEnd, description }: InspectPopupProps) {
    return (
        <Popup
            isOpen={showPopup}
            title="Suunniteltu työvuoro"
            height="fit-content"
            onBackGroundClick={handleCancel}>
            <InspectShiftSubtitle>Ajankohta:</InspectShiftSubtitle>
            <InspectShiftFirstP>{workDateStart?.toLocaleDateString("fi-FI", { weekday: "short", day: "numeric", month: "numeric", year: "numeric" })}</InspectShiftFirstP>
            <InspectShiftP>klo {workDateStart?.toLocaleTimeString("fi-FI").slice(0, -3)} - {workDateEnd?.toLocaleTimeString("fi-FI").slice(0, -3)}</InspectShiftP>
            {description &&
                <><InspectShiftSubtitle>Lisätiedot:</InspectShiftSubtitle>
                <InspectShiftFirstP>{description}</InspectShiftFirstP></>}
            <BlueButton onClick={handleCancel}><UndoIcon />&nbsp;Takaisin</BlueButton>
        </Popup>
    )
}