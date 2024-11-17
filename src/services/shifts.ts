import { AxiosResponse } from "axios";
import { ShiftRes, ShiftTimeRes } from "../models/shifts";
import axiosClient from "./axiosClient";

// Haetaan työntekijän viikon työvuorot:
export async function getShiftsOfWeek(employeeId: number, shiftType: string) {
    const response: AxiosResponse<ShiftTimeRes> = await axiosClient.get("/shifts/week/" + employeeId.toString() + "/" + shiftType)
    return response.data
}

// Leimataan työntekijän työvuoro alkaneeksi
export async function startShift() {
    const response: AxiosResponse<ShiftRes> = await axiosClient.post("/shifts/start")
    return response.data
}