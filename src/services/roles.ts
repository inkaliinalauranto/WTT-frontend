import { AxiosResponse } from "axios";
import { Role } from "../models/roles";
import axiosClient from "./apiClient";


export async function getRole(id:number) {
    const response: AxiosResponse<Role> = await axiosClient.get("/roles/" + id)
    return response.data
}
