import { Link } from "react-router-dom";
import { BlueButton, GreenButton, RedButton } from "../assets/css/button";
import { getShiftsOfWeek, startShift } from "../services/shifts";


export default function EmployeePage() {

    // TESTI:
    const printPlannedShifts = () => {
        getShiftsOfWeek(1, "planned").then((shifts) => {
            console.log(shifts)
        })
    }

    // TESTI:
    const printConfirmedShifts = () => {
        getShiftsOfWeek(1, "confirmed").then((shifts) => {
            console.log(shifts)
        })
    }

    const printStartedShift = () => {
        startShift().then((shift) => {
            console.log(shift)
        })
    }
 
    return <>
        <h1>EmployeePage</h1>
        {/*TESTI:*/}
        <RedButton onClick={printPlannedShifts}></RedButton>
        <GreenButton onClick={printConfirmedShifts}></GreenButton>
        <BlueButton onClick={printStartedShift}></BlueButton>
    </>
}