import axios, { AxiosResponse } from "axios";
import { Team } from "../models/teams";


export async function getTeam(id: number) {
    const response: AxiosResponse<Team> = await axios.get("/teams/" + id)
    return response.data
}
