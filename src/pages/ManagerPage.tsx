import EmployeeCard from "../components/EmployeeCard";
import { useEffect, useState } from "react";
import { getShiftsTodayByEmployeeId } from "../services/shifts";
import { getAllEmployeesByManagerTeamId } from "../services/users";
import { authStore } from "../store/authStore";
import { snapshot } from "valtio";
import { AuthUser } from "../models/auth";
import { ShiftRes } from "../models/shifts";
import { CircularProgress } from "@mui/material";
import { CardsLayout } from "../assets/css/cardsLayout";


export default function ManagerPage() {
    const snap = snapshot(authStore)
    const [employees, setEmployees] = useState<AuthUser[]>([])
    const [allShifts, setAllShifts] = useState<ShiftRes[][]>([])
    const [isLoading, setLoading] = useState(false)
    
    async function fetchData() {
        setLoading(true)
        try {
            // Haetaan managerin tiimissä olevat työntekijät
            const employeeArray = await getAllEmployeesByManagerTeamId(snap.authUser.teamId)
            setEmployees(employeeArray)
            
            // Haetaan työntekijän kaikki työvuorot listana ja laitetaan ne toiseen listaan
            const shiftsArray = await Promise.all(
                employeeArray.map((employee) => getShiftsTodayByEmployeeId(employee.id))
            )
            setAllShifts(shiftsArray)
        }
        catch (e) {
            if (e instanceof Error) {
                console.log("Error", e.message);
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchData();
    }, [])

    const employeeCards = Array(employees.length).fill(null).map((_, i) => {
        return <EmployeeCard key={i} shiftList={allShifts[i]} employee={employees[i]}/>
    })

    return <CardsLayout>
        {isLoading? <CircularProgress/> : employeeCards}
    </CardsLayout>
}
