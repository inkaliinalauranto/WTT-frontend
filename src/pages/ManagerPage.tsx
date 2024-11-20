import { Link } from "react-router-dom";
import EmployeeCard from "../components/EmployeeCard";
import { ShiftRes } from "../models/shifts";


export type employeeMockUpAuthUserista = {
    id: number
    first_name: string
    last_name: string
    team_id: number
}

const employee1:employeeMockUpAuthUserista = {
    id: 1,
    first_name: "Eero",
    last_name: "Esimerkki",
    team_id: 1
}
const employee2:employeeMockUpAuthUserista = {
    id: 2,
    first_name: "Maija",
    last_name: "Malli",
    team_id: 1
}
const employee3:employeeMockUpAuthUserista = {
    id: 3,
    first_name: "Maarit",
    last_name: "Mockup",
    team_id: 1
}
const dataMockup1: Array<ShiftRes> = [
    {
        "id": 1,
        "start_time": "2024-11-20T20:00:00",
        "end_time": "2024-11-20T21:00:00",
        "user_id": 1,
        "shift_type_id": 1,
        "description": "string"
    },
    {
        "id": 2,
        "start_time": "2024-11-20T19:53:02",
        "end_time": "2024-11-20T23:53:02",
        "user_id": 1,
        "shift_type_id": 2,
        "description": "string"
    },
    {
        "id": 3,
        "start_time": "2024-11-21T00:25:12",
        "end_time": "",
        "user_id": 1,
        "shift_type_id": 2,
        "description": "string"
    }
]
const dataMockup2: Array<ShiftRes> = []
const dataMockup3: Array<ShiftRes> = [
    {
        "id": 4,
        "start_time": "2024-11-21T01:00:00",
        "end_time": "2024-11-21T10:00:00",
        "user_id": 3,
        "shift_type_id": 1,
        "description": "string"
    },
    {
        "id": 5,
        "start_time": "2024-11-20T23:12:42",
        "end_time": null,
        "user_id": 3,
        "shift_type_id": 2,
        "description": "string"
    }
]


export default function ManagerPage() {
    return <>
        <h1>ManagerPage</h1>
        <EmployeeCard shiftList={dataMockup1} employee={employee1}></EmployeeCard>
        <EmployeeCard shiftList={dataMockup2} employee={employee2}></EmployeeCard>
        <EmployeeCard shiftList={dataMockup3} employee={employee3}></EmployeeCard>
        <Link to="/inspect">Inspectaa työntekijää</Link>
    </>
}
