import { proxy } from "valtio"
import { getAccount, loginService, logoutService } from "../services/auth"
import { LoginReq } from "../models/auth"
import { getRole } from "../services/roles"


export const authStore = proxy({
    loggedIn: false,
    isLoading: false,
    error: "",
    authUser: {
        id: 0,
        username: "",
        firstName: "",
        lastName: "",
        roleId: 0,
        roleName: "",
        teamId: 0
    },
    async login(credentials: LoginReq) {
        try {
            authStore.isLoading = true

            const data = await loginService(credentials)

            authStore.authUser.id = data.auth_user.id
            authStore.authUser.username = data.auth_user.username
            authStore.authUser.firstName = data.auth_user.first_name
            authStore.authUser.lastName = data.auth_user.last_name
            authStore.authUser.roleId = data.auth_user.role_id
            authStore.authUser.teamId = data.auth_user.team_id
            
            const role = await getRole(data.auth_user.role_id)
            console.log(role.name)
            authStore.authUser.roleName = role.name

            authStore.loggedIn = true
        }
        catch (e: unknown) {
            if (e instanceof Error) {
                if (e.message == "401" || e.message == "404") {
                    authStore.error = "Invalid username or password"
                } else {
                    authStore.error = e.message
                }
            } 
            else {
                authStore.error = "An unknown error occurred";
            }
        }
        authStore.isLoading = false
    },
    async logout() {
        try {
            await logoutService()

            authStore.isLoading = true
            authStore.authUser.id = 0
            authStore.authUser.username = ""
            authStore.authUser.firstName = ""
            authStore.authUser.lastName = ""
            authStore.authUser.roleId = 0
            authStore.authUser.teamId = 0

            authStore.loggedIn = false
        }
        catch(e) {
            throw new Error("Error on logout")
        }
        authStore.isLoading = false
    },
    async account() {
        try {
            authStore.isLoading = true

            const auth_user = await getAccount()
            
            authStore.authUser.id = auth_user.id
            authStore.authUser.username = auth_user.username
            authStore.authUser.firstName = auth_user.first_name
            authStore.authUser.lastName = auth_user.last_name
            authStore.authUser.roleId = auth_user.role_id
            authStore.authUser.teamId = auth_user.team_id
            
            const role = await getRole(auth_user.role_id)
            authStore.authUser.roleName = role.name

            authStore.loggedIn = true
        }
        catch (e: unknown) {
            
            if (e instanceof Error) {
                if (e.message == "401" || e.message == "404") {
                    authStore.error = "Accout not found"
                } else {
                    authStore.error = e.message
                }
            } 
            else {
                authStore.error = "An unknown error occurred"
            }
        }
        authStore.isLoading = false
    },
    setError(message: string) {
        authStore.error = message
    },
    setLoading(bool: boolean) {
        authStore.isLoading = bool
    }
})
