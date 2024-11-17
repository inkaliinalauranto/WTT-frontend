import { AxiosResponse } from "axios";
import { Team } from "../models/teams";
import axiosClient from "./axiosClient";


export async function getTeam(id: number) {
    const response: AxiosResponse<Team> = await axiosClient.get("/teams/" + id)
    return response.data
}
