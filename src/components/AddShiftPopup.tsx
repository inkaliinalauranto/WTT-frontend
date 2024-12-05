import DatePicker from "react-datepicker"
import { Form } from "../assets/css/form"
import { Popup } from "./Popup"
import HourPicker from "./HourPicker"
import { Textfield } from "../assets/css/textfield"
import { Row } from "../assets/css/row"
import { BlueButton, GreenButton } from "../assets/css/button"
import { fi } from "date-fns/locale/fi"
import { CircularProgress } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import { AddShiftPopupProps } from "../models/layout"

  
export function AddShiftPopup(addProps: AddShiftPopupProps) {
    return (
        <Popup
        isOpen={addProps.showPopup}
        title="Lisää työvuoro"
        width="500px"
        height="450px"
        onBackGroundClick={addProps.close}
    >
        <Form onSubmit={addProps.addShift}>
            <DatePicker
                required={true}
                className="custom-input"
                calendarClassName="custom-calendar"
                locale={fi}
                selected={addProps.date}
                onChange={(newDate) => addProps.setDate(newDate)}
                placeholderText="Päivämäärä"
                dateFormat={"dd.MM.yyyy"}
            />
            <HourPicker
                required={true}
                value={addProps.startTime}
                onChange={addProps.setStartTime}
                placeholder="Aloitus"
            />
            <HourPicker
                required={true}
                value={addProps.endTime}
                onChange={addProps.setEndTime}
                placeholder="Lopetus"
            />
            <Textfield
                required={false}
                placeholder="Lisätiedot"
                type="text"
                value={addProps.description}
                onChange={(e) => addProps.setDescription(e.target.value)}
            /> {/*✓*/}
            <Row>
                <BlueButton onClick={addProps.close}><UndoIcon />&nbsp;Takaisin</BlueButton>
                {addProps.isLoading ?
                    <GreenButton disabled={true}><CircularProgress color={"inherit"} size={30} /></GreenButton>
                    : <GreenButton type="submit"><CheckIcon />&nbsp;Tallenna</GreenButton>
                }
            </Row>
        </Form>
    </Popup>
    )
}