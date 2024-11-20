
import { useState } from "react";
import { AccountTopBar } from "../assets/css/accounttopbar";
import { BlueButton, GreenButton, RedButton } from "../assets/css/button";
import { Layout } from "../assets/css/layout";
import { Popup } from "../components/PopUp";
import { Textfield } from "../assets/css/textfield";
import { Row } from "../assets/css/row";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { fi } from "date-fns/locale/fi"
import TimePicker from 'react-time-picker';

import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/datepicker.css"
import 'react-time-picker/dist/TimePicker.css';



export default function InspectEmployeePage() {

    const [date, setDate] = useState<Date | null>(null); // Allow null as an initial value

    const [time, setTime] = useState<string | null>(null); // Allow null as a possible value

    const [isPopupOpen, setIsPopupOpen] = useState(false);


    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);


    registerLocale("fi", fi)

    return <Layout>
        <AccountTopBar justifyContent="space-between">
            <BlueButton onClick={() => console.log("Takaisin")}>Takaisin</BlueButton>
            <div>Työnkeijänm nimi</div>
            <RedButton>Poista työntekijä</RedButton>
        </AccountTopBar>
        <GreenButton onClick={openPopup}>Lisää työvuoro</GreenButton>
        <Popup
            isOpen={isPopupOpen}
            title="Lisää työvuoro"
            width="500px"
            height="400px"
        >
            <TimePicker
                onChange={(newTime: string | null) => setTime(newTime)} // Handle both string and null
                value={time}
                disableClock={true}
            />

            <DatePicker
                className="custom-input"
                calendarClassName="custom-calendar"
                locale={fi}
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                placeholderText="Päivämäärä"
            />
            <Textfield required
                type="text"
                placeholder="Alku"
            ></Textfield>
            <Textfield required
                type="text"
                placeholder="Loppu"
            ></Textfield>
            <Row>
                <BlueButton onClick={closePopup}>Takaisin</BlueButton>
                <GreenButton>✓</GreenButton>
            </Row>
        </Popup>
    </Layout>
}
