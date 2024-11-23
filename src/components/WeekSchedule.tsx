import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { useEffect, useRef, useState } from 'react';
import { getShiftsOfWeek, removeShift, updateShift } from '../services/shifts';
import { Calendar, Cover, InputBox } from '../assets/css/calendar';
import fiLocale from "@fullcalendar/core/locales/fi"
import { BlueButton, GreenButton, RedButton } from '../assets/css/button';
import { snapshot } from 'valtio';
import { authStore } from '../store/authStore';
import { ShiftReq } from '../models/shifts';
import { EmployeeId } from '../models/roles';

// Käytetty ChatGPT:tä:
export function WeekSchedule({ employeeId }: EmployeeId) {
    const [events, setEvents] = useState<EventInput[]>([])
    const [earliestWorkTime, setEarliestShift] = useState("23:59:59")
    const [showEdit, setShowEdit] = useState(false)
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [selectedEventId, setSelectedEventId] = useState(0)
    const [signedInUserSnap] = useState(snapshot(authStore))
    // Tätä tarvitaan UseEffectissa scrollTimen asettamisessa:
    const calendarRef = useRef<FullCalendar>(null);


    const setShiftsAsEvents = () => {
        getShiftsOfWeek(employeeId, "planned").then((shifts) => {
            const shiftsAsEvents: EventInput[] = shifts.map((shift) => {

                // Alla olevat neljä riviä liittyvät scroll-barin 
                // asettamiseen aikaisimman vuoron ajankohtaan:
                const splittedStartDate = shift.start_time.split("T")
                const startTime = splittedStartDate[1]

                if (startTime < earliestWorkTime) {
                    setEarliestShift(startTime)
                }

                // EventInput-objektitietotyypillä on id-, title-, start- ja 
                // end-propertyt:
                const shiftAsEvent: EventInput = {
                    id: shift.id.toString(),
                    start: shift.start_time,
                    // Voidaan laittaa nulliksi (!), koska planned-tyypin 
                    // shiftillä on aina lopetusaika:
                    end: shift.end_time!
                }

                return shiftAsEvent
            })

            setEvents(shiftsAsEvents)

            // console.log("2024-11-22T08:00:00.266Z" < "2024-11-22T16:00:00.266Z")
            // console.log("23:59:57.266Z" > "23:59:59.266Z")
        })
    }


    const adjustScroll = () => {
        const calendarApi = calendarRef.current?.getApi();

        if (calendarApi) {
            // const start = calendarApi.view.activeStart.toISOString();
            // Tähän pitää tehdä vielä se, että hakee vain viikon vuorot, 
            // ja ottaa aikaisimman vuoron ajankohdan, nyt asettelee 
            // scrollin kaikkien vuorojen kaikista aikaisimman aloitusajan 
            // mukaan:
            const splittedTime = earliestWorkTime.split(":")
            const hourAsInt = parseInt(splittedTime[0])

            if (hourAsInt > 1) {
                const newTime = "0" + (hourAsInt - 1).toString() + ":30:00"
                calendarApi.scrollToTime(newTime)
            } else {
                calendarApi.scrollToTime(earliestWorkTime)
            }
        }
    }


    useEffect(() => {
        setShiftsAsEvents()
        adjustScroll()
    }, [earliestWorkTime, showEdit])


    // ChatGPT:
    const formatDayHeader = (date: Date) => {
        const dayNames = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];
        const dayName = dayNames[date.getDay()];
        const formattedDate = date.toLocaleDateString('fi-FI', {
            day: 'numeric',
            month: 'numeric',
        });
        return `${dayName} ${formattedDate}`;
    };


    // ChatGPT (väliaikaisratkaisu):
    function getLocalISOString(date: Date): string {
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localTime = new Date(date.getTime() - timezoneOffset);
        return localTime.toISOString().replace('Z', '');
    }


    // Laitan kommentit myöhemmin:
    const handleEventClick = (info: any) => {
        // Vain manageri voi muokata tai poistaa vuoron
        if (signedInUserSnap.authUser.roleName === "manager") {
            setShowEdit(true)
            setStartDate(getLocalISOString(info.event.start))
            setEndDate(getLocalISOString(info.event.end))
            const eventId = info.event.id;
            setSelectedEventId(eventId)
        }
    }


    const handleSave = () => {
        const reqBody: ShiftReq = {
            start_time: startDate,
            end_time: endDate,
            user_id: employeeId,
            shift_type_id: 2,
            description: ""
        }

        updateShift(selectedEventId, reqBody).then((shift) => {
            console.log(shift)
            setSelectedEventId(0)
            setShowEdit(false)
        })
    }


    const handleRemove = () => {
        removeShift(selectedEventId).then(() => {
            setSelectedEventId(0)
            setShowEdit(false)
        })
    }

    // palkeille tyylitiedostossa -> cursor: pointer:
    // Luokka: .fc-v-event .fc-event-title-container
    return (
        <Calendar>
            {!showEdit &&
                <FullCalendar
                    eventClick={handleEventClick}
                    ref={calendarRef}
                    buttonText={{ today: "Tänään", week: "Viikko" }}
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    events={events}
                    nowIndicator={true}
                    headerToolbar={{
                        left: 'today',
                        center: 'title',
                        right: 'prev,next'
                    }}
                    height="600px"
                    firstDay={1}
                    allDaySlot={false}
                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit'
                    }}
                    // ChatGPT: 
                    dayHeaderContent={(args) => formatDayHeader(args.date)}
                    locale={fiLocale}
                    titleFormat={{
                        week: "short"
                    }}
                    weekText='Viikko'
                />}

            {showEdit &&
                <Cover>
                    <InputBox>
                        <label htmlFor="starttime">Syötä aloitusaika:</label>
                        <input value={startDate} onChange={(e) => { setStartDate(e.target.value) }} id="starttime" type="text" />
                        <label htmlFor="endtime">Syötä lopetusaika:</label>
                        <input value={endDate} onChange={(e) => { setEndDate(e.target.value) }} id="endtime" type="text" />
                        <GreenButton onClick={handleSave}>Tallenna</GreenButton>
                        <RedButton onClick={handleRemove}>Poista vuoro</RedButton>
                        <BlueButton onClick={() => setShowEdit(false)}>Peruuta</BlueButton>
                    </InputBox>
                </Cover>}
        </Calendar>
    );
}