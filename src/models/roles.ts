import FullCalendar from "@fullcalendar/react";

export type Role = {
    id: number;
    name: string;
}

export type EmployeeShift = {
    employeeId: number;
    calendarRef: React.RefObject<FullCalendar>;
}