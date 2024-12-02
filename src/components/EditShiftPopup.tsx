import { BlueButton, GreenButton, RedButton } from "../assets/css/button"
import { Row } from "../assets/css/row"
import { Popup } from "./Popup"
import DeleteIcon from '@mui/icons-material/Delete';
import HourPicker from './HourPicker';
import { Form } from '../assets/css/form';
import { Textfield } from '../assets/css/textfield';
import { CircularProgress } from '@mui/material';
import { ResponsiveSettings } from "../assets/css/responsive";
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';
import { EditPopupProps } from "../models/layout";


export function EditShiftPopup(editProps: EditPopupProps) {
    return (
        <Popup
        isOpen={editProps.showPopup}
        title="Muokkaa työvuoroa"
        width="500px"
        height="fit-content"
        onBackGroundClick={editProps.handleCancel}
    >
        <Form onSubmit={editProps.handleSave}>
            <HourPicker
                required={true}
                value={editProps.startTime}
                onChange={editProps.setStartTime}
                placeholder="Aloitusaika"
            />
            <HourPicker
                required={true}
                value={editProps.endTime}
                onChange={editProps.setEndTime}
                placeholder="Lopetusaika"
            />
            <Textfield
                required={false}
                type="text"
                value={editProps.description}
                onChange={(e) => { editProps.setDescription(e.target.value) }}
                maxLength={100}
                placeholder={"Kuvaus, ei pakollinen"}
            />
            {editProps.width <= parseInt(ResponsiveSettings.smallScreenMaxWidth.replace("px", ""), 10) ?
                <>  {/*Responsive mode, all buttons in row*/}
                    <Row>
                        <BlueButton onClick={editProps.handleCancel}><UndoIcon />&nbsp;Takaisin</BlueButton>
                        <RedButton onClick={editProps.openDeletePopup}><DeleteIcon />&nbsp;Poista</RedButton>
                        {editProps.isLoading ? <GreenButton><CircularProgress color={"inherit"} size={30} /></GreenButton> : <GreenButton type="submit"><CheckIcon />&nbsp;Tallenna</GreenButton>}
                    </Row>

                </>
                : <>  {/*Normal mode, delete button bottom*/}
                    <Row>
                        <BlueButton onClick={editProps.handleCancel}><UndoIcon />&nbsp;Takaisin</BlueButton>
                        {editProps.isLoading ? <GreenButton><CircularProgress color={"inherit"} size={30} /></GreenButton> : <GreenButton type="submit"><CheckIcon />&nbsp;Tallenna</GreenButton>}
                    </Row>
                    <RedButton onClick={editProps.openDeletePopup}><DeleteIcon />&nbsp;Poista</RedButton>
                </>}
        </Form>
    </Popup>

    )
}