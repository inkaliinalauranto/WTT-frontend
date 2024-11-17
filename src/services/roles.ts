import axios, { AxiosResponse } from "axios";
import { Role } from "../models/roles";


export async function getRole(id:number) {
    const response: AxiosResponse<Role> = await axios.get("/roles/" + id)
    return response.data
}
