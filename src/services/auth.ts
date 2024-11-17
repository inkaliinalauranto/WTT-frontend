import axios, { AxiosResponse } from "axios";
import { AuthUser, LoginReq, LoginRes } from "../models/auth";


export async function loginService(credentials: LoginReq) {
    const response: AxiosResponse<LoginRes> = await axios.post("/auth/login", credentials)
    return response.data
}

export async function getAccount() {
    const response: AxiosResponse<AuthUser> = await axios.get("/auth/user")
    return response.data
}

export async function logoutService() {
    const response = await axios.post("/auth/logout")
    return response.data
}
