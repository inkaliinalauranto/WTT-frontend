import { AxiosResponse } from "axios";
import { ShiftRes, ShiftTimeRes } from "../models/shifts";
import axiosClient from "./axiosClient";

// Haetaan työntekijän viikon työvuorot:
export async function getShiftsOfWeek(employeeId: number, shiftType: string) {
    const response: AxiosResponse<ShiftTimeRes> = await axiosClient.get("/shifts/week/" + employeeId.toString() + "/" + shiftType)
    return response.data
}

// Leimataan kirjautuneen työntekijän työvuoro alkaneeksi:
export async function startShift() {
    const response: AxiosResponse<ShiftRes> = await axiosClient.post("/shifts/start")
    return response.data
}

// Haetaan kirjautuneen työntekijän aloittama työvuoro:
export async function getStartedShift(employeeId: number) {
    const response: AxiosResponse<ShiftRes | null> = await axiosClient.get("/shifts/started/" + employeeId.toString())
    return response.data
}

// Leimataan kirjautuneen työntekijän työvuoro päättyneeksi:
export async function endShift(shiftId: number) {
    const response: AxiosResponse<ShiftRes> = await axiosClient.patch("/shifts/end/" + shiftId)
    return response.data
}

export async function getShiftsTodayByEmployeeId(employeeId: number) {
    const response: AxiosResponse<ShiftRes[]> = await axiosClient.get("/shifts/today/" + employeeId)
    return response.data
}