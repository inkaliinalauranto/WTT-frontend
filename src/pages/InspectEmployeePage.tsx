
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
import { useLocation, useNavigate } from "react-router-dom";
import { AuthUser } from "../models/auth";
import { addShiftToUser } from "../services/shifts";
import { ShiftData } from "../models/shifts";



// Register Finnish locale
registerLocale("fi", fi);

export default function InspectEmployeePage() {
    const [date, setDate] = useState<Date | null>(null); // Allow null as an initial value
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const location = useLocation();
    const state = location.state as { employee: AuthUser };
    const { employee } = state;

    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Navigate back to the previous page
    };

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const addShift = async () => {
        if (!date || !startTime || !endTime) {
            alert("Täytä kaikki kentät ennen tallennusta!");
            return;
        }

        const startDateTime = new Date(`${date.toISOString().split("T")[0]}T${startTime}`);
        const endDateTime = new Date(`${date.toISOString().split("T")[0]}T${endTime}`);

        // Convert to ISO strings
        const startIsoString = startDateTime.toISOString();
        const endIsoString = endDateTime.toISOString();

        const shiftData = {
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            description: "",
        };


        console.log("Sending to API:", { start: startIsoString, end: endIsoString });

        //API call
        try {
            const result = await addShiftToUser(employee?.id as number, shiftData);
            console.log("Shift added successfully:", result);
            closePopup(); // Close the popup on success
        } catch (error) {
            console.error("Error adding shift:", error);
            alert("Virhe työvuoron lisäämisessä.");
        }

    };

    return (
        <Layout>
            <AccountTopBar justifyContent="space-between">
                <BlueButton onClick={handleGoBack}>Takaisin</BlueButton>
                <div>
                    {employee?.first_name} {employee?.last_name}
                </div>
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
                <HourPicker
                    value={startTime}
                    onChange={setStartTime}
                    placeholder="Aloitus"
                />
                <HourPicker
                    value={endTime}
                    onChange={setEndTime}
                    placeholder="Lopetus"
                />
                <Row>
                    <BlueButton onClick={closePopup}>Takaisin</BlueButton>
                    <GreenButton onClick={addShift}>✓</GreenButton>
                </Row>
            </Popup>
        </Layout>
    );
}