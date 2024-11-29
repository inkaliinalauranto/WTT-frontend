// Näiden täytyy olla tismalleen samat kuin backendissä olevat.
// Eli käytetään snake_case

export type AuthUser = {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    role_id: number;
    team_id: number;
    is_working: boolean;
}

export type LoginRes = {
    auth_user: AuthUser;
    access_token: string;
}

export type LoginReq = {
    username: string;
    password: string;
}
// Työntekijän rekisteröintirequesti
// role_id on null koska se määritellään backendin puolella
export type RegisterReq = {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
    email: string;
    role_id: null;
    team_id: number;
}