import { BlueButton } from "../assets/css/button"
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
            <p style={{ marginTop: "0.5em", fontWeight: "bold" }}>Ajankohta:</p>
            <p style={{ marginBottom: "0.5em", marginTop: "0.5em", fontSize: "1.2em" }}>{workDateStart?.toLocaleDateString("fi-FI", { weekday: "short", day: "numeric", month: "numeric", year: "numeric" })}</p>
            <p style={{ marginBottom: "0.5em", fontSize: "1.2em" }}>klo {workDateStart?.toLocaleTimeString("fi-FI").slice(0, -3)} - {workDateEnd?.toLocaleTimeString("fi-FI").slice(0, -3)}</p>
            {description &&
                <><p style={{ marginTop: "0.5em", fontWeight: "bold" }}>Lisätiedot:</p><p style={{ marginBottom: "0.5em", marginTop: "0.5em", fontSize: "1.2em" }}>{description}</p></>}
            <BlueButton onClick={handleCancel}><UndoIcon />&nbsp;Takaisin</BlueButton>
        </Popup>
    )
}