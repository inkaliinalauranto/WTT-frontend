import EmployeeCard from "../components/EmployeeCard";
import { useEffect, useState } from "react";
import { getShiftsByDateByEmployeeId, getShiftsTodayByEmployeeId } from "../services/shifts";
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


export default function ManagerPage() {
    const snap = snapshot(authStore)
    const [employees, setEmployees] = useState<AuthUser[]>([])
    const [allShifts, setAllShifts] = useState<ShiftRes[][]>([])
    const [isLoading, setLoading] = useState(false)
    const [scaleHours, setScaleHours] = useState<number>(5)
    const [currentHourPosition, setCurrentHourPosition] = useState<number>(-1)
    const [date, setThisDate] = useState(new Date())
    const [position, setPosition] = useState(8)

    const day = date.getDate().toString()
    const month = (date.getMonth() + 1).toString()
    const year = date.getFullYear().toString()


    async function fetchData(_date: Date | undefined = undefined) {
        setLoading(true)
        try {
            // Haetaan työntekijät
            const employeeArray = await getAllEmployeesByManagerTeamId(snap.authUser.teamId)
            setEmployees(employeeArray)
            
            let shiftsArray;
            // Date ei annettu -> haetaan tämän päivän työvuorot
            if (_date == undefined) {
                // Haetaan työntekijän kaikki työvuorot listana ja laitetaan ne toiseen listaan
                shiftsArray = await Promise.all(
                    employeeArray.map((employee) => getShiftsTodayByEmployeeId(employee.id))
                )
            }
            // Päivämäärä annettu, joten fetcahtaan vain kyseisen päivän työvuorot kaikille käyttäjille
            else {
                shiftsArray = await Promise.all(
                    employeeArray.map((employee) => getShiftsByDateByEmployeeId(employee.id, _date.toISOString()))
                )
            }

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
        fetchData();

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

        fetchData(_date);
    }
    function prevDay() {
        const _date = new Date(date)
        _date.setDate(date.getDate() - 1)
        setThisDate(_date)

        fetchData(_date);
    }
    function thisDay() {
        setThisDate(new Date())
        fetchData();
    }
 

    return <>
        <FlexContainer>
            <LeftAligned>
                <GreenButton>Lisää työntekijä</GreenButton>
            </LeftAligned>
            <CenterAligned>
                <DayWeekSwitcher onLeftClick={prevDay} onRightClick={nextDay} date={day + "." + month + "." + year}/>
            </CenterAligned>
            <RightAligned>
                <BlueButton onClick={thisDay}>Tänään</BlueButton>
            </RightAligned>
        </FlexContainer>
        
        <SlidersDiv>
            <label htmlFor="timeScale-slider"><ZoomInIcon/></label>
            <input onChange={handleTimeScale} onMouseUp={storeValues} type="range" id="timeScale-slider" min="-8" max="-3" step="1" value={scaleHours} />
            <label htmlFor="currentHourPosition-slider"><AccessTimeIcon/></label>
            <input onChange={handlePosition} onMouseUp={storeValues} type="range" id="currentHourPosition-slider" min={-position} max={position} step="1" value={currentHourPosition} />
        </SlidersDiv>

        <CardsLayout>
            {isLoading? <LoadingComponent/> : employeeCards}
        </CardsLayout>
    </>
}
