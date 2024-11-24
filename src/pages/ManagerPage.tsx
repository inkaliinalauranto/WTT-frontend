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

    // Setupataan managerpage managerpagen luonnin yhteydessä
    useEffect(() => {
        getEmployees();

        // Haetaan käyttäjän asettamat asetukset jos on.
        const zoomLvl = localStorage.getItem("zoom-lvl");
        setScaleHours(zoomLvl? parseInt(zoomLvl, 10) : 5)
        const hourPos = localStorage.getItem("hour-position")
        setCurrentHourPosition(hourPos? parseInt(hourPos, 10) : -1)
    }, [])

    // Luodaan dynaamisesti employee kortit
    let employeeCards = Array(employees.length).fill(null).map((_, i) => {
        return <EmployeeCard key={i} shiftList={allShifts[i]} employee={employees[i]} scaleHours={scaleHours} shiftCurrentHourPosition={currentHourPosition} date={date}/>
    })

    // Muutetaan zoomin perusteella "aikakursor"sliderin rangea, jotta sitä ei voida koskaan viedä piiloon
    // Chatgpt generoitua koodia
    useEffect(() => {
        if (currentHourPosition < -position) {
            setCurrentHourPosition(-position);
        } else if (currentHourPosition > position) {
            setCurrentHourPosition(position);
        }
    }, [position, currentHourPosition]);

    
    /* Tapahtumakuuntelijat */

    function handleTimeScale(e: React.ChangeEvent<HTMLInputElement>) {
        const value = parseInt(e.target.value, 10)

        // Jos "aikakursori" slider on vasemmassa tai oikeassa laidassa, ei siirretä sitä zoomatessa, 
        // vaan skaalataan zoom rangea vastakkaiseen suuntaan
        setScaleHours(value)
        setPosition(-value)
        
        let newPosition = currentHourPosition
    
        if (currentHourPosition-1 == value) {
            newPosition = currentHourPosition-1
        }
        else if (currentHourPosition+1 == -value) {
            newPosition = currentHourPosition+1
        }
        setCurrentHourPosition(newPosition)
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
 

    return <>
        <Spacer height={15}/>
        <FlexContainer>
            <LeftAligned>
                <GreenButton><PersonAddIcon/>&nbsp;Lisää työntekijä</GreenButton>
            </LeftAligned>
            <CenterAligned>
                <DayWeekSwitcher onLeftClick={prevDay} onRightClick={nextDay} date={day + "." + month + "." + year}/>
            </CenterAligned>
            <RightAligned>
                <BlueButton disabled={isDisabled} onClick={thisDay}><TodayIcon/>&nbsp;Tänään</BlueButton>
            </RightAligned>
        </FlexContainer>
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
