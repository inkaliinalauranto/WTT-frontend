import { AxiosResponse } from "axios";
import { AuthUser, LoginReq, LoginRes } from "../models/auth";
import axiosClient from "./axiosClient";


export async function loginService(credentials: LoginReq) {
    const response: AxiosResponse<LoginRes> = await axiosClient.post("/auth/login", credentials)
    return response.data
}

export async function getAccount() {
    const response: AxiosResponse<AuthUser> = await axiosClient.get("/auth/user")
    return response.data
}

export async function logoutService() {
    const response = await axiosClient.post("/auth/logout")
    return response.data
}
