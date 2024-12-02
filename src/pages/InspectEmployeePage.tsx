
import { useRef, useState } from "react";
import { AccountTopBar } from "../assets/css/accounttopbar";
import { BlueButton, GreenButton, RedButton } from "../assets/css/button";
import { EmployeeTitle, Layout, Spacer } from "../assets/css/layout";
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
import { getStartAndEndTimes } from "../tools/popup";
import { Form } from "../assets/css/form";
import FullCalendar from "@fullcalendar/react";
import { CircularProgress } from "@mui/material";
import AddchartIcon from '@mui/icons-material/Addchart';
import DeleteIcon from '@mui/icons-material/Delete';
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';


export default function InspectEmployeePage() {

    // Register Finnish locale
    registerLocale("fi", fi);

    const [date, setDate] = useState<Date | null>(null); // Initially no date selected

    const [isLoading, setLoading] = useState(false)

    const [startTime, setStartTime] = useState<string>(""); // Initially empty
    const [endTime, setEndTime] = useState<string>(""); // Initially empty
    const [shiftDescription, setShiftDescription] = useState<string>("")

    const [isAddShiftPopupOpen, setIsAddShiftPopupOpen] = useState(false);

    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);

    const calendarRef = useRef<FullCalendar>(null);

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
    const openDeletePopup = () => setIsDeletePopupOpen(true);
    const closeDeletePopup = () => setIsDeletePopupOpen(false);


    // Kun popup-ikkuna suljetaan, tyhjennetään tilamuuttujat, joissa 
    // pidetään lukua kenttien sisällöistä:
    const resetFields = () => {
        setDate(null)
        setStartTime("")
        setEndTime("")
        setShiftDescription("")
    }


    // Functions to open and close the popup
    const openAddShiftPopup = () => setIsAddShiftPopupOpen(true);
    
    const closeAddShiftPopup = () => {
        setIsAddShiftPopupOpen(false)
        resetFields()
    };

    const deleteEmployee = async () => {
        try {
            setLoading(true)
            await deleteEmployeeById(employee?.id as number);
        } catch (error) {
            alert("Virhe työntekijän poistamisessa.");
        }
        setLoading(false)
        navigate("/")
    }

    // Function to handle adding a shift
    const addShift = async (e: React.FormEvent<HTMLFormElement>) => {
        //This prevents the default html form submit from placing a ? at the end of the url fucking up the whole page :D
        e.preventDefault()

        const shiftStartAndEnd = getStartAndEndTimes(date, startTime, endTime)

        // Jos kenttiin ei ole kirjoitettu, ei tehdä mitään vaan palataan 
        // tästä funktiosta: 
        if (shiftStartAndEnd == null) {
            return;
        }

        const shiftData = {
            start_time: shiftStartAndEnd.start,
            end_time: shiftStartAndEnd.end,
            description: shiftDescription,
        };

        try {
            setLoading(true)
            //Lähetetään lisätty vuoro service-funktion kautta backendiin:
            const result = await addShiftToUser(employee?.id as number, shiftData);

            // Visualisoidaan muutokset myös kalenteriin:
            const calendarApi = calendarRef.current?.getApi()
            if (calendarApi) {
                calendarApi.addEvent({
                    id: result.id.toString(), 
                    title: shiftDescription,
                    start: shiftStartAndEnd?.start,
                    end: shiftStartAndEnd?.end
                })
            }

            closeAddShiftPopup();
        } catch (error) {
            alert("Virhe työvuoron lisäämisessä.");
        }
        setLoading(false)
    };
    return (
        <Layout>
            <AccountTopBar justifycontent="space-between">
                <BlueButton onClick={handleGoBack}><UndoIcon/>&nbsp;Takaisin</BlueButton>
                <GreenButton onClick={openAddShiftPopup}><AddchartIcon/>&nbsp;Lisää vuoro</GreenButton>
                <RedButton onClick={openDeletePopup} ><DeleteIcon/>&nbsp;Poista työntekijä</RedButton>
            </AccountTopBar>
            <EmployeeTitle>
                {employee?.first_name} {employee?.last_name}
            </EmployeeTitle>
            <Popup
                isOpen={isDeletePopupOpen}
                onBackGroundClick={closeDeletePopup}
                title="Poista työntekijä"
            >
                <p>
                    Oletko varma, että haluat poistaa pysyvästi <br></br> 
                    työntekijän <strong>{employee.first_name} {employee.last_name}</strong>?
                </p>
                <Row>
                    <BlueButton onClick={closeDeletePopup}>
                        <UndoIcon/>&nbsp;Takaisin
                    </BlueButton>
                    {isLoading ? 
                        <RedButton disabled={true}><CircularProgress color={"inherit"} size={30}/></RedButton> 
                        : <RedButton onClick={deleteEmployee}><DeleteIcon/>&nbsp;Poista</RedButton>
                    }
                   
                </Row>   
            </Popup>

            {/* Add shift pop up */}
            <Popup
                isOpen={isAddShiftPopupOpen}
                title="Lisää työvuoro"
                width="500px"
                height="450px"
                onBackGroundClick={closeAddShiftPopup}
            >
                <Form onSubmit={addShift}>
                    <DatePicker
                        required={true}
                        className="custom-input"
                        calendarClassName="custom-calendar"
                        locale={fi}
                        selected={date}
                        onChange={(newDate) => setDate(newDate)}
                        placeholderText="Päivämäärä"
                        dateFormat={"dd.MM.yyyy"}
                    />
                    <HourPicker
                        required={true}
                        value={startTime}
                        onChange={setStartTime}
                        placeholder="Aloitus"
                    />
                    <HourPicker
                        required={true}
                        value={endTime}
                        onChange={setEndTime}
                        placeholder="Lopetus"
                    />
                    <Textfield
                        required={false}
                        placeholder="Lisätiedot"
                        type="text"
                        value={shiftDescription}
                        onChange={(e) => setShiftDescription(e.target.value)}
                    /> {/*✓*/}
                    <Row>
                        <BlueButton onClick={closeAddShiftPopup}><UndoIcon/>&nbsp;Takaisin</BlueButton>
                        {isLoading ? 
                            <GreenButton disabled={true}><CircularProgress color={"inherit"} size={30}/></GreenButton> 
                            : <GreenButton type="submit"><CheckIcon/>&nbsp;Tallenna</GreenButton>
                        }
                    </Row>
                </Form>
            </Popup>
            <Spacer height={10} />
            <WeekSchedule employeeId={employee.id as number} calendarRef={calendarRef} isAddPopupOpen={isAddShiftPopupOpen}/>
        </Layout>
    );
}