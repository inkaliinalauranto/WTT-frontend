
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
import DayWeekSwitcher from "../components/DayWeekSwitcher";
import { FlexContainer, LeftAligned, CenterAligned } from "../assets/css/DayWeekSwitcher";
import { getCurrentWeekNumber } from "../tools/currentWeek";


// Register Finnish locale
registerLocale("fi", fi);

export default function InspectEmployeePage() {

    const [date, setDate] = useState<Date | null>(null); // Initially no date selected

    const [startTime, setStartTime] = useState<string>(""); // Initially empty
    const [endTime, setEndTime] = useState<string>(""); // Initially empty

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    // Retrieve employee data passed via navigation state
    const location = useLocation();
    const state = location.state as { employee: AuthUser };
    const { employee } = state;

    // Navigation hook for going back or to other routes
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // Goes back one step in history
    };

    // Functions to open and close the popup
    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    const [weekNumber, setWeekNumber] = useState(getCurrentWeekNumber());

    // Function to increase the week number
    const increaseWeek = () => {
        setWeekNumber(prevWeek => prevWeek + 1);
    };

    // Function to decrease the week number
    const decreaseWeek = () => {
        setWeekNumber(prevWeek => Math.max(prevWeek - 1, 1)); // Ensure it doesn't go below 1
    };

    // Function to handle adding a shift
    const addShift = async () => {
        // Ensure all required inputs are filled
        if (!date || !startTime || !endTime) {
            alert("Täytä kaikki kentät ennen tallennusta!");
            return;
        }

        // Construct Date objects for start and end times
        const startDateTime = new Date(`${date.toISOString().split("T")[0]}T${startTime}`);
        const endDateTime = new Date(`${date.toISOString().split("T")[0]}T${endTime}`);

        // Convert dates to ISO strings for the API
        const startIsoString = startDateTime.toISOString();
        const endIsoString = endDateTime.toISOString();

        // Prepare the shift data payload
        const shiftData = {
            start_time: startIsoString, // ISO string for start time
            end_time: endIsoString, // ISO string for end time
            description: "", // Empty description for now
        };

        console.log("Sending to API:", { start: startIsoString, end: endIsoString });

        // Make the API call to add the shift
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
                <div>
                    {employee?.first_name} {employee?.last_name}
                </div>
                <RedButton>Poista työntekijä</RedButton>
            </AccountTopBar>
            <FlexContainer>
                <LeftAligned>
                    <GreenButton onClick={openPopup}>Lisää työvuoro</GreenButton>
                </LeftAligned>
                <CenterAligned>
                    <DayWeekSwitcher
                        date={"Viikko: " + weekNumber}
                        onLeftClick={decreaseWeek}
                        onRightClick={increaseWeek} />
                </CenterAligned>
            </FlexContainer>
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