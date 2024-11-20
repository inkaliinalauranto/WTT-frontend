
import { useState } from "react";
import { AccountTopBar } from "../assets/css/accounttopbar";
import { BlueButton, GreenButton, RedButton } from "../assets/css/button";
import { Layout } from "../assets/css/layout";
import { Popup } from "../components/Popup";
import { Row } from "../assets/css/row";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { fi } from "date-fns/locale/fi"
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/datepicker.css"
import HourPicker from "../components/HourPicker";



export default function InspectEmployeePage() {

    const [date, setDate] = useState<Date | null>(null); // Allow null as an initial value

    const [startTime, setStartTime] = useState<string>('');

    const [endTime, setEndTime] = useState<string>('');

    const handleStartTimeChange = (newTime: string) => {
        setStartTime(newTime);
    };

    const handleEndTimeChange = (newTime: string) => {
        setEndTime(newTime);
    };

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
            <DatePicker
                className="custom-input"
                calendarClassName="custom-calendar"
                locale={fi}
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                placeholderText="Päivämäärä"
            />
            <HourPicker value={startTime} onChange={handleStartTimeChange} placeholder="Aloitus" />
            <HourPicker value={endTime} onChange={handleEndTimeChange} placeholder="Lopetus"/>
            <Row>
                <BlueButton onClick={closePopup}>Takaisin</BlueButton>
                <GreenButton>✓</GreenButton>
            </Row>
        </Popup>
    </Layout>
}
