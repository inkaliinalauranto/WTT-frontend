import { proxy } from "valtio"
import { getAccount, loginService, logoutService } from "../services/auth"
import { LoginReq } from "../models/auth"


export const authStore = proxy({
    loggedIn: false,
    authUser: {
        id: 0,
        username: "",
        roleId: 0,
        teamId: 0
    },
    async login(credentials: LoginReq) {
        try {
            const data = await loginService(credentials)
            console.log(data)
            
            if (!data.auth_user) {
                throw new Error()
            }
            this.loggedIn = true
            this.authUser = {
                id: data.auth_user.id,
                username: data.auth_user.username,
                roleId: data.auth_user.role_id,
                teamId: data.auth_user.team_id
            }
        }
        catch(e) {
            console.log(e)
            throw new Error("Invalid username or password")
        }
    },
    async logout() {
        try {
            await logoutService()
            this.loggedIn = false
        }
        catch(e) {
            throw new Error("Error on logout")
        }
    },
    async tryAutoLogin() {
        const data = await getAccount()

        if (data) {
            this.loggedIn = false
            this.authUser = {
                id: data.id,
                username: data.username,
                roleId: data.role_id,
                teamId: data.team_id
            }
        }
    },
    get isAuth() {
        return this.loggedIn
    }
})
