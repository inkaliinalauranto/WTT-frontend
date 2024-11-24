import { proxy } from "valtio"
import { getAccount, loginService, logoutService } from "../services/auth"
import { LoginReq } from "../models/auth"
import { getRole } from "../services/roles"
import { getOrg } from "../services/organizations"
import { getTeam } from "../services/teams"


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
        teamId: 0,
        orgId: 0,
        orgName: ""
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

            const team = await getTeam(data.auth_user.team_id)
            const org = await getOrg(team.organization_id)
            console.log(org.name)
            authStore.authUser.orgId = org.id
            authStore.authUser.orgName = org.name

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
                authStore.error = "An unknown error occurred on login";
            }
        }
        authStore.isLoading = false
    },
    async logout() {
        try {
            authStore.isLoading = true
            await logoutService()

            authStore.authUser.id = 0
            authStore.authUser.username = ""
            authStore.authUser.firstName = ""
            authStore.authUser.lastName = ""
            authStore.authUser.roleId = 0
            authStore.authUser.roleName = ""
            authStore.authUser.teamId = 0
            authStore.authUser.orgId = 0
            authStore.authUser.orgName = ""

            authStore.loggedIn = false
        }
        catch(e) {
            authStore.error = "An unknown error occurred on logout"
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

            const team = await getTeam(auth_user.team_id)
            const org = await getOrg(team.organization_id)
            authStore.authUser.orgId = org.id
            authStore.authUser.orgName = org.name

            authStore.loggedIn = true
        }
        catch (e: unknown) {
            
            if (e instanceof Error) {
                if (e.message !== "401" && e.message !== "404") {
                    authStore.error = e.message
                }
            } 
            else {
                authStore.error = "An unknown error occurred on getAccount"
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
