import { AxiosResponse } from "axios";
import { AuthUser} from "../models/auth";
import axiosClient from "./axiosClient";


export async function getAllEmployeesByManagerTeamId(manager_team_id: number) {
    const response: AxiosResponse<Array<AuthUser>> = await axiosClient.get("/users/manager/" + manager_team_id)
    return response.data
}

export async function deleteEmployeeById(id: number){
    const response: AxiosResponse<AuthUser> = await axiosClient.delete("/users/" + id)
    return response.data
}
