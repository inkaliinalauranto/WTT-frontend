import { useEffect, useRef, useState } from "react";
import { GreenButton, RedButton } from "../assets/css/button";
import { endShift, getStartedShift, startShift } from "../services/shifts";
import { authStore } from "../store/authStore";
import { WeekSchedule } from "../components/WeekSchedule";
import { snapshot } from "valtio";
import { Spacer } from "../assets/css/layout";
import FullCalendar from "@fullcalendar/react";
import { ShiftOperationsRow } from "../assets/css/row";
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import DoorFrontIcon from '@mui/icons-material/DoorFront';


export default function EmployeePage() {
    /* Kun isDisabled-muuttuja on false, "Aloita vuoro"-nappi on enabloitu ja 
    "Lopeta vuoro"-nappi disabloitu:
    */
    const [isDisabled, setIsDisabled] = useState(false)

    /* shiftId-muuttujaan talletetaan aloitetun vuoron id, jotta sitä voidaan 
    käyttää "Lopeta vuoro"-nappiin liittyvän funktion service-metodikutsussa: */
    const [shiftId, setShiftId] = useState(0)

    const [signedInUserSnap] = useState(snapshot(authStore))

    // Kalenterille välitettävä referenssi:
    const calendarRef = useRef<FullCalendar>(null);


    /* Komponentin renderöinnin yhteydessä (useEffect-funktiokutsun toisena 
    parametrina hakasulut), kutsutaan getStartedShift-service-funktiota, 
    joka hakee kirjautuneen käyttäjän aloitetun vuoron. Jos aloitettu vuoro 
    on null, ei työntekijällä ole keskeneräistä vuoroa, jolloin 
    "Aloita vuoro"-nappi voidaan enabloida asettamalla 
    isDisabled-tilamuuttujan arvo falseksi. Muussa tapauksessa, eli jos 
    aloitettu vuoro löytyy, asetetaan shiftId-tilamuuttujan arvoksi aloitetun 
    vuoron id ja disabloidaan "Aloita vuoro"-nappi asettamalla 
    isDisabled-tilamuuttujan arvo todeksi. */
    useEffect(() => {
        getStartedShift(signedInUserSnap.authUser.id).then((shift) => {
            if (shift == null) {
                setIsDisabled(false)
            } else {
                setShiftId(shift.id)
                setIsDisabled(true)
            }
        })
    }, [])


    /* Kun "Aloita vuoro"-nappia klikataan sen ollessa enabloitu, kutsutaan 
    startShift-service-funktiota, joka leimaa työvuoron alkaneeksi ja 
    palauttaa ShiftRes-tyyppiä olevan objektin. Asetetaan 
    shiftId-tilamuuttujan arvoksi tämän aloitettua työvuoroa kuvaavan objektin 
    id ja disabloidaan "Aloita vuoro"-nappi asettamalla isDisabled trueksi. */
    const beginShift = () => {
        startShift().then((shift) => {
            setShiftId(shift.id)
            setIsDisabled(true)
        })
    }

    /* Kun "Lopeta vuoro"-nappia klikataan sen ollessa enabloitu, kutsutaan 
    endShift-service-funktiota, jolle välitetään parametrina 
    shiftId-tilamuuttujassa oleva aloitetun vuoron id. service-funktion 
    kautta vuorolle asetetaan lopetusleima backendissä. Asetetaan sitten 
    shiftId-tilamuuttujan arvo 0:aan merkiksi siitä, ettei avointa vuoroa 
    enää ole ja enabloidaan "Aloita vuoro"-nappi asettamalla isDisabled 
    falseksi. */
    const finishShift = () => {
        endShift(shiftId).then(() => {
            setShiftId(0)
            setIsDisabled(false)
        })
    }

    return <>
        <Spacer height={30} />
        <div style={{width: "100%"}} className={"employee-calendar"}>
            <WeekSchedule employeeId={signedInUserSnap.authUser.id} calendarRef={calendarRef}/>
        </div>

        <ShiftOperationsRow>
            {/*"Aloita vuoro"-nappi on disabloitu, kun isDisabled-tilamuuttujan 
                arvo on true: */}
            <GreenButton disabled={isDisabled} onClick={beginShift}><MeetingRoomIcon/>&nbsp;Aloita vuoro</GreenButton>
            {/*"Lopeta vuoro"-nappi on disabloitu, kun isDisabled-tilamuuttujan 
                arvo on false: */}
            <RedButton disabled={!isDisabled} onClick={finishShift}><DoorFrontIcon/>&nbsp;Lopeta vuoro</RedButton>
        </ShiftOperationsRow>
    </>
}