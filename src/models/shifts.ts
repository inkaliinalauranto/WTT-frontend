export type ShiftTimeRes = {
    id: number
    shift_type: string
    start_time: string
    end_time: string | null
    description: string | null
}

export type ShiftRes = {
    id: number
    start_time: string
    end_time: string | null
    user_id: number
    shift_type_id: number
    description: string | null
}

export type ShiftReq = {
    start_time: string;
    end_time: string;
    description: string;
}

export type ShiftData = {
    start_time: string; // ISO 8601 datetime string
    end_time: string; // ISO 8601 datetime string
    description: string;
}