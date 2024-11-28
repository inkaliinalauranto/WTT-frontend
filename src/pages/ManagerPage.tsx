import EmployeeCard from "../components/EmployeeCard";
import { useEffect, useState } from "react";
import { getShiftsMonthToleranceFromTodayByEmployeeId } from "../services/shifts";
import { getAllEmployeesByManagerTeamId } from "../services/users";
import { authStore } from "../store/authStore";
import { snapshot } from "valtio";
import { AuthUser } from "../models/auth";
import { ShiftRes } from "../models/shifts";
import { CardsLayout } from "../assets/css/cardsLayout";
import LoadingComponent from "../components/LoadingComponent";
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { SlidersDiv } from "../assets/css/slidersDiv";
import DayWeekSwitcher from "../components/DayWeekSwitcher";
import { BlueButton, GreenButton } from "../assets/css/button";
import { CenterAligned, FlexContainer, LeftAligned, RightAligned } from "../assets/css/DayWeekSwitcher";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TodayIcon from '@mui/icons-material/Today';
import { Spacer } from "../assets/css/layout";
import React from "react";
import { Popup } from "../components/Popup";
import { Form } from "../assets/css/form";
import { Textfield } from "../assets/css/textfield";
import { Row } from "../assets/css/row";
import UndoIcon from '@mui/icons-material/Undo';
import CheckIcon from '@mui/icons-material/Check';
import { CircularProgress } from "@mui/material";
import { registerEmployee } from "../services/auth";


export default function ManagerPage() {
    const snap = snapshot(authStore)

    const [employees, setEmployees] = useState<AuthUser[]>([])
    const [allShifts, setAllShifts] = useState<ShiftRes[][]>([])
    const [isLoading, setLoading] = useState(false)
    const [scaleHours, setScaleHours] = useState<number>(5)
    const [currentHourPosition, setCurrentHourPosition] = useState<number>(-1)
    const [date, setThisDate] = useState(new Date())
    const [position, setPosition] = useState(8)
    const [isDisabled, setDisabled] = useState(false)
    const [employeeCards, setEmployeeCards] = useState<any[]>([])
    const [messageReceived, setMessageReceived] = useState(0)

    // Työntekijän lisäys
    const [isAddEmpPopupOpen, setIsAddEmpPopupOpen] = useState(false);
    const [newEmpUsername, setNewEmpUsername] = useState<string>("")
    const [newEmpPassword, setNewEmpPassword] = useState<string>("")
    const [newEmpFirstname, setNewEmpFirstname] = useState<string>("")
    const [newEmpLastname, setNewEmpLastname] = useState<string>("")
    const [newEmpEmail, setNewEmpEmail] = useState<string>("")


    // Päivämäärä
    const day = date.getDate().toString()
    const month = (date.getMonth() + 1).toString()
    const year = date.getFullYear().toString()
    const now = new Date()

    // Tänään napin disablointi
    useEffect(() => {
        if (
            date.getDate() == now.getDate() && 
            date.getMonth() == now.getMonth() && 
            date.getFullYear() == now.getFullYear() 
        ) {
            setDisabled(true)
            
        } else {
            setDisabled(false)
        }
    },[date])

    // Popup-jutskat
    const resetFields = () => {
        setNewEmpFirstname("")
        setNewEmpLastname("")
        setNewEmpEmail("")
        setNewEmpUsername("")
        setNewEmpPassword("")
    }

    const openAddEmployeePopup = () => setIsAddEmpPopupOpen(true)

    const closeAddEmpPopup = () => {
        setIsAddEmpPopupOpen(false)
        resetFields()
    }



    /* `````````````````````````````````` */
    /*           Alkusetuppaus            */
    /* .................................. */
    async function getEmployees() {
        setLoading(true)
        try {
            // Haetaan työntekijät
            const employeeArray = await getAllEmployeesByManagerTeamId(snap.authUser.teamId)
            setEmployees(employeeArray)
            await fetchData(employeeArray)
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e);
            }
        }
        setLoading(false)
    }
   
    async function fetchData(employees:AuthUser[]) {
        setLoading(true)
        try {
            // Haetaan työntekijän kaikki työvuorot listana ja laitetaan ne toiseen listaan
            const shiftsArray = await Promise.all(
                employees.map((employee) => getShiftsMonthToleranceFromTodayByEmployeeId(employee.id))
            )
            setAllShifts(shiftsArray)
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e);
            }
        }
        setLoading(false)
    }

    // Luodaan uudet kortit heti, kun shiftit on fetchattu tai päivämäärä muuttuu.
    useEffect(() => {
        console.log(messageReceived)
        setEmployeeCards(
            Array(employees.length).fill(null).map((_, i) => {
                return <EmployeeCard 
                key={i} 
                shiftList={allShifts[i]} 
                employee={employees[i]} 
                scaleHours={scaleHours} 
                shiftCurrentHourPosition={currentHourPosition} 
                date={date} 
                isWorking={employees[i].is_working}
                />
            })
        );
    }, [allShifts, date, currentHourPosition, scaleHours, messageReceived])


    /* ```````````````````````````````````````````````````````````````` */
    /*           Websocket  ja alkusetuppauksen käynnistys              */
    /* ................................................................ */

    // Setupataan managerpage managerpagen luonnin yhteydessä
    useEffect(() => {
        getEmployees();

        // Haetaan käyttäjän asettamat asetukset jos on.
        const zoomLvl = localStorage.getItem("zoom-lvl");
        setScaleHours(zoomLvl? parseInt(zoomLvl, 10) : 5)
        const hourPos = localStorage.getItem("hour-position")
        setCurrentHourPosition(hourPos? parseInt(hourPos, 10) : -1)


        // Luodaan websocket yhteys
        const socket = new WebSocket("ws://localhost:8000/ws"+ "/" + snap.authUser.orgId);
        socket.onmessage = (event) => {
            // Parsitaan event.data, joka on asetettu EmployeePagessa
            const message = JSON.parse(event.data)

            // Jos viesti on tiimin jäseneltä
            if (message.teamId == snap.authUser.teamId) {
                // Jos viestin tyyppi on sisään tai ulosleimaus
                if (message.type === "shift-in" || "shift-out") {
                    // Haetaan uudet päivitetyt employeet uudestaan ja setataan ne state muuttujaan
                    getAllEmployeesByManagerTeamId(snap.authUser.teamId).then((employeeArray) => {  
                        setEmployees(employeeArray)
                        // Jotta saan launchattua useEffectin renderöimään uudet kortit, asetetaan
                        // messageReceivedin arvoksi messageReceived + 1
                        // Jotta state päivittyy, sille määritetään mitä sille staten arvolle tapahtuu
                        // nuolen avulla
                        setMessageReceived(messageReceived => messageReceived + 1)
                    })
                }
            }
        }
        // Suljetaan yhteys
        return () => socket.close()
    }, [])



    /* `````````````````````````````````` */
    /*        Tapahtumakuuntelijat        */
    /* .................................. */

    // Muutetaan zoomin perusteella "aikakursor"sliderin rangea, jotta sitä ei voida koskaan viedä piiloon
    // Chatgpt generoitua koodia
    useEffect(() => {
        if (currentHourPosition < -position) {
            setCurrentHourPosition(-position);
        } else if (currentHourPosition > position) {
            setCurrentHourPosition(position);
        }
    }, [position, currentHourPosition]);


    function handleTimeScale(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value, 10)

        // Jos "aikakursori" slider on vasemmassa tai oikeassa laidassa, ei siirretä sitä zoomatessa, 
        // vaan skaalataan zoom rangea vastakkaiseen suuntaan
        setScaleHours(value)
        setPosition(-value)        
    }

    function handlePosition(e: React.ChangeEvent<HTMLInputElement>) {
        setCurrentHourPosition(parseInt(e.target.value, 10));
    }

    function storeValues() {
        localStorage.setItem("zoom-lvl", scaleHours.toString())
        localStorage.setItem("hour-position", currentHourPosition.toString())
    }

    function nextDay() {
        const _date = new Date(date)
        _date.setDate(date.getDate() + 1)
        setThisDate(_date)
    }

    function prevDay() {
        const _date = new Date(date)
        _date.setDate(date.getDate() - 1)
        setThisDate(_date)
    }

    function thisDay() {
        setThisDate(new Date())
    }

    /* `````````````````````````````````` */
    /*        Työntekijän lisäys          */
    /* .................................. */

    const addEmployee = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Jos ei ole täytetty kenttiä, palataan takaisin
        // Tosin kentissä itsessään oleva required-tagi jo estää tämän, mutta hyvähän se on olla varmuuden vuoksi
        if (!newEmpFirstname || !newEmpLastname || !newEmpEmail || !newEmpUsername || !newEmpPassword) {
            return
        }

        // Otetaan talteen uuden käyttäjän tiedot, jotka välitetään backendille rekisteröintiä varten
        const newEmployee = {
            username: newEmpUsername,
            password: newEmpPassword,
            first_name: newEmpFirstname,
            last_name: newEmpLastname,
            email: newEmpEmail,
            role_id: null, // Role määritetään automaagisesti Employeeksi backendin puolella
            team_id: snap.authUser.teamId // Työntekijä rekisteröidään samaan tiimiin managerin kanssa
        }

        try {
            setLoading(true)
            const result = await registerEmployee(newEmployee)
            console.log("Työntekijä rekisteröity: ", result)
            closeAddEmpPopup()
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Virhe työntekijän rekisteröinnissä.");
        }
        setLoading(false)
        // Päivitetään käyttäliittymä
        getEmployees()
     }
 

    return <>
        <Spacer height={30}/>
        <FlexContainer>
            <LeftAligned>
                <GreenButton onClick={openAddEmployeePopup}><PersonAddIcon/>&nbsp;Lisää työntekijä</GreenButton>
            </LeftAligned>
            <CenterAligned>
                <DayWeekSwitcher onLeftClick={prevDay} onRightClick={nextDay} date={day + "." + month + "." + year}/>
            </CenterAligned>
            <RightAligned>
                <BlueButton disabled={isDisabled} onClick={thisDay}><TodayIcon/>&nbsp;Tänään</BlueButton>
            </RightAligned>
        </FlexContainer>

        {/* "Lisää Työntekijä"-popup */}
        <Popup
                isOpen={isAddEmpPopupOpen}
                title="Lisää uusi työntekijä"
                width="500px"
                height="500px"
                onBackGroundClick={closeAddEmpPopup}
            >
                <Form onSubmit={addEmployee}>
                    <Textfield
                        required={true}
                        placeholder="Etunimi"
                        type="text"
                        value={newEmpFirstname}
                        onChange={(e) => setNewEmpFirstname(e.target.value)}
                    />
                    <Textfield
                        required={true}
                        placeholder="Sukunimi"
                        type="text"
                        value={newEmpLastname}
                        onChange={(e) => setNewEmpLastname(e.target.value)}
                    />
                    <Textfield
                        required={true}
                        placeholder="Sähköposti"
                        type="text"
                        value={newEmpEmail}
                        onChange={(e) => setNewEmpEmail(e.target.value)}
                    />
                    <Textfield
                        required={true}
                        placeholder="Käyttäjänimi"
                        type="text"
                        value={newEmpUsername}
                        onChange={(e) => setNewEmpUsername(e.target.value)}
                    />
                    <Textfield
                        required={true}
                        placeholder="Salasana"
                        type="password"
                        value={newEmpPassword}
                        onChange={(e) => setNewEmpPassword(e.target.value)}
                    />
                    <Row>
                        <BlueButton onClick={closeAddEmpPopup}><UndoIcon/>&nbsp;Takaisin</BlueButton>
                        {isLoading ? 
                            <GreenButton disabled={true}><CircularProgress color={"inherit"} size={30}/></GreenButton> 
                            : <GreenButton type="submit"><CheckIcon/>&nbsp;Lisää työntekijä</GreenButton>
                        }
                    </Row>
                </Form>
            </Popup>

        <Spacer height={15}/>
        <SlidersDiv>
            <label htmlFor="timeScale-slider"><ZoomInIcon/></label>
            <input onChange={handleTimeScale} onMouseUp={storeValues} type="range" id="timeScale-slider" min="-8" max="-3" step="1" value={scaleHours} />
            <label htmlFor="currentHourPosition-slider"><AccessTimeIcon/></label>
            <input onChange={handlePosition} onMouseUp={storeValues} type="range" id="currentHourPosition-slider" min={-position} max={position} step="1" value={currentHourPosition} />
        </SlidersDiv>
        <Spacer height={5}/>
        <CardsLayout>
            {isLoading? <LoadingComponent/> : employeeCards}
        </CardsLayout>
    </>
}
