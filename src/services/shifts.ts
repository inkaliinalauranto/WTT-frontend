import { AxiosResponse } from "axios";
import { ShiftReq, ShiftData, ShiftRes, ShiftTimeRes } from "../models/shifts";
import axiosClient from "./axiosClient";

// Haetaan työntekijän viikon työvuorot:
export async function getShifts(employeeId: number, shiftType: string) {
    const response: AxiosResponse<ShiftTimeRes[]> = await axiosClient.get("/shifts/week/" + employeeId.toString() + "/" + shiftType)
    return response.data
}

// Leimataan kirjautuneen työntekijän työvuoro alkaneeksi:
export async function startShift() {
    const response: AxiosResponse<ShiftRes> = await axiosClient.post("/shifts/start")
    return response.data
}

// Haetaan kirjautuneen työntekijän aloittama työvuoro:
export async function getStartedShift() {
    const response: AxiosResponse<ShiftRes | null> = await axiosClient.get("/shifts/started")
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

export async function getShiftsMonthToleranceFromTodayByEmployeeId(employeeId: number) {
    const response: AxiosResponse<ShiftRes[]> = await axiosClient.get("/shifts/today/" + employeeId + "/tolerance/" + 60)
    return response.data
}


export async function getShiftsByDateByEmployeeId(employeeId: number, date: string) {
    const response: AxiosResponse<ShiftRes[]> = await axiosClient.get("/shifts/" + date + "/" + employeeId)
    return response.data
}

export async function addShiftToUser(employeeId: number, shiftData: ShiftData): Promise<ShiftRes> {
    const response: AxiosResponse<ShiftRes> = await axiosClient.post(`/shifts/add/${employeeId}`,
        shiftData // Send shift data in the request body
    );
    return response.data;
}

// Päivitetään työvuoron tiedot työvuoron id:n perusteella:
export async function updateShift(shiftId: number, reqBody: ShiftReq) {
    const response: AxiosResponse<ShiftRes> = await axiosClient.patch("/shifts/" + shiftId.toString(), reqBody)
    return response.data
}

// Poistetaan työvuoro työvuoron id:n peusteella:
export async function removeShift(shiftId: number) {
    const response: AxiosResponse<ShiftRes> = await axiosClient.delete("/shifts/" + shiftId.toString())
    return response.data
}