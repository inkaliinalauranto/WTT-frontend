// Näiden täytyy olla tismalleen samat kuin backendissä olevat.
// Eli käytetään snake_case

export type AuthUser = {
    id: number;
    username: string;
    role_id: number;
    team_id: number;
}

export type LoginRes = {
    auth_user: AuthUser;
    access_token: string;
}

export type LoginReq = {
    username: string;
    password: string;
}