export type ShiftTimeRes = {
    id: number
    weekday: string
    shift_type: string
    start_time: string
    end_time: string | null
}

export type ShiftRes = {
    id: number
    start_time: string
    end_time: string | null
    user_id: number
    shift_type_id: number
    description: string | null
}

export type ShiftData = {
    start_time: string; // ISO 8601 datetime string
    end_time: string; // ISO 8601 datetime string
    description: string;
}