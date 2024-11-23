
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
import { WeekSchedule } from "../components/WeekSchedule";
import { deleteEmployeeById } from "../services/users";
import { Textfield } from "../assets/css/textfield";

export default function InspectEmployeePage() {

    // Register Finnish locale
    registerLocale("fi", fi);

    const [date, setDate] = useState<Date | null>(null); // Initially no date selected

    const [startTime, setStartTime] = useState<string>(""); // Initially empty
    const [endTime, setEndTime] = useState<string>(""); // Initially empty
    const [shiftDescription, setShiftDescription] = useState<string>("")

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Retrieve employee data passed via navigation state
    const location = useLocation();
    const state = location.state as { employee: AuthUser } | undefined;
    // Tässä asetetaan default käyttäjäksi id 0 ja muut unknown sitä varten jos käyttäjä yrittää mennä suoraan osoitteeseen /inspect/employeeId
    const { employee } = state ?? { employee: { id: '0', first_name: 'Unknown', last_name: "Unknown", role: 'Unknown' } };

    // Navigation hook for going back or to other routes
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Goes back one step in history
    };

    // Functions to open and close the popup
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const deleteEmployee = async () => {
        try {
            const result = await deleteEmployeeById(employee?.id as number);
            console.log("Employee deleted successfully:", result);
        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Virhe työntekijän poistamisessa.");
        }
    }

    // Function to handle adding a shift
    const addShift = async () => {
        if (!date || !startTime || !endTime) {
            alert("Täytä kaikki kentät ennen tallennusta!");
            return;
        }

        // Create the start and end date-time objects directly from the date and time values
        const startDateTime = new Date(date); // Convert selected date to a Date object
        const endDateTime = new Date(date); // Do the same for the end time

        // Set the time using the startTime and endTime strings
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        startDateTime.setHours(startHour, startMinute, 0, 0); // Set the start time correctly
        endDateTime.setHours(endHour, endMinute, 0, 0); // Set the end time correctly

        // Convert to ISO string to ensure correct format for API
        const startIsoString = startDateTime.toISOString();
        const endIsoString = endDateTime.toISOString();

        const shiftData = {
            start_time: startIsoString,
            end_time: endIsoString,
            description: shiftDescription,
        };

        console.log("Sending to API:", { start: startIsoString, end: endIsoString });

        try {
            const result = await addShiftToUser(employee?.id as number, shiftData);
            console.log("Shift added successfully:", result);
            closePopup();
        } catch (error) {
            console.error("Error adding shift:", error);
            alert("Virhe työvuoron lisäämisessä.");
        }
    };
    return (
        <Layout>
            <AccountTopBar justifyContent="space-between">
                <BlueButton onClick={handleGoBack}>Takaisin</BlueButton>

                <RedButton onClick={deleteEmployee} >Poista työntekijä</RedButton>
                <GreenButton onClick={openPopup}>Lisää työvuoro</GreenButton>
            </AccountTopBar>
            <h1>
                {employee?.first_name} {employee?.last_name}
            </h1>
            <Popup
                isOpen={isPopupOpen}
                title="Lisää työvuoro"
                width="500px"
                height="400px"
                footerContent={
                    <Row>
                        <BlueButton onClick={closePopup}>Takaisin</BlueButton>
                        <GreenButton onClick={addShift}>✓</GreenButton>
                    </Row>}
            >
                <DatePicker
                    className="custom-input"
                    calendarClassName="custom-calendar"
                    locale={fi}
                    selected={date}
                    onChange={(newDate) => setDate(newDate)}
                    placeholderText="Päivämäärä"
                    dateFormat={"dd/MM/yyyy"}
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
                <Textfield
                    type="text"
                    placeholder="Lisätiedot"
                    value={shiftDescription}
                    onChange={(e) => setShiftDescription(e.target.value)} />
            </Popup>
            <div style={{ marginTop: "60px" }} />
            <WeekSchedule employeeId={employee.id as number} />
        </Layout>
    );
}