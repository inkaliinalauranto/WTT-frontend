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
    end_time: string
    user_id: number
    shift_type_id: number
    description: string | null
}