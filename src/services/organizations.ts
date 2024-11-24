import { AxiosResponse } from "axios";
import { Organization } from "../models/organizations";
import axiosClient from "./axiosClient";

export async function getOrg(id: number) {
    const response: AxiosResponse<Organization> = await axiosClient.get("/organizations/" + id)
    return response.data
}