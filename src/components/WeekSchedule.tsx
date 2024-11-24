import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { useEffect, useRef, useState } from 'react';
import { getShifts, removeShift, updateShift } from '../services/shifts';
import { Calendar } from '../assets/css/calendar';
import fiLocale from "@fullcalendar/core/locales/fi"
import { BlueButton, GreenButton, RedButton } from '../assets/css/button';
import { snapshot } from 'valtio';
import { authStore } from '../store/authStore';
import { ShiftReq } from '../models/shifts';
import { EmployeeShift } from '../models/roles';
import { Popup } from './Popup';
import HourPicker from './HourPicker';
import { Textfield } from '../assets/css/textfield';
import { getStartAndEndTimes } from '../tools/popup';
import { Form } from '../assets/css/form';
import { Row } from '../assets/css/row';
import DeleteIcon from '@mui/icons-material/Delete';
import { ConfirmDeletePopup } from './ConfirmDeletePopup';


export function WeekSchedule({ employeeId, calendarRef }: EmployeeShift) {
    const [events, setEvents] = useState<EventInput[]>([])
    const [showEdit, setShowEdit] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState(0)
    const [signedInUserSnap] = useState(snapshot(authStore))
    const [workDate, setWorkDate] = useState<Date | null>(null)
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [description, setDescription] = useState("")
    const [deleteConfirmPopup, setDeleteConfirmPopup] = useState(false)


    const openDeletePopup = () => {
        setShowEdit(false)
        setDeleteConfirmPopup(true);
    }


    const closeDeletePopup = () => {
        setDeleteConfirmPopup(false)
    };


    // Haetaan suunnitellut vuorot ja lisätään ne EventInput-tietotyyppisinä 
    // events-tilamuuttujaan: 
    const setShiftsAsEvents = () => {
        getShifts(employeeId, "planned").then((shifts) => {
            console.log("Haetaan kaikki vuorot API:sta....")
            const shiftsAsEvents: EventInput[] = shifts.map((shift) => {
                // Kalenteri osaa huomioida aikavyöhykkeen, kun ajan antaa 
                // ISO-muodossa: 
                const startDate = shift.start_time + ".000Z"
                // Voidaan laittaa nulliksi (!), koska planned-tyypin 
                // shiftillä on aina lopetusaika:
                const endDate = shift.end_time! + ".000Z"

                const shiftAsEvent: EventInput = {
                    id: shift.id.toString(),
                    title: shift.description == null ? "" : shift.description,
                    start: startDate,
                    end: endDate
                }

                return shiftAsEvent
            })

            setEvents(shiftsAsEvents)
        })
    }


    // Kun komponentti renderöidään, haetaan työvuorot API:sta:
    useEffect(() => {
        setShiftsAsEvents()
    }, [])


    // Formatoidaan viikonpäivät (ChatGPT:n antama ratkaisu):
    const formatDayHeader = (date: Date) => {
        const dayNames = ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'];
        const dayName = dayNames[date.getDay()];
        const formattedDate = date.toLocaleDateString('fi-FI', {
            day: 'numeric',
            month: 'numeric',
        });
        return `${dayName} ${formattedDate}`;
    };


    // ChatGPT:n generoima funktio, joka muuttaa Date-tietotyypin arvon 
    // kuin ISO-string-muotoon mutta joka huomioi Suomen aikavyöhykkeen: 
    function getLocalISOString(date: Date): string {
        const timezoneOffset = date.getTimezoneOffset() * 60000;
        const localTime = new Date(date.getTime() - timezoneOffset);
        return localTime.toISOString().replace('Z', '');
    }


    // Kun vuoroa klikataan, tämä funktio avaa popup-ikkunan, jossa työvuoroa 
    // voi muokata tai sen voi poistaa, jos käyttäjän rooli on manager: 
    const handleEventClick = (info: any) => {
        if (signedInUserSnap.authUser.roleName === "manager") {
            setShowEdit(true)
            // Asetetaan klikatun vuoron aloitusajankohta 
            // workDate-tilamuuttujaan: 
            setWorkDate(new Date(info.event.start))
            // Asetetaan klikatun vuoron aloitus- ja lopetusajat start- ja 
            // endTime-muuttujiin, jolloin tiedot täyttyvät oletuksina 
            // popupin kenttiin, joiden kautta muokkaukset tehdään: 
            setStartTime(getLocalISOString(info.event.start).substring(11, 16))
            setEndTime(getLocalISOString(info.event.end).substring(11, 16))
            // Asetetaan klikatun vuoron mahdollinen kuvaus 
            // description-tilamuuttujaan: 
            setDescription(info.event.title)
            // Asetetaan klikatun työvuoron id tilamuuttujaan, josta se 
            // voidaan noutaa, kun vuoroa päivitetään tai vuoro poistetaan: 
            setSelectedEventId(info.event.id)
        }
    }


    // Kun popup-ikkuna suljetaan, tyhjennetään tilamuuttujat, joissa 
    // pidetään lukua kenttien sisällöistä:
    const resetFields = () => {
        setWorkDate(null)
        setStartTime("")
        setEndTime("")
        setDescription("")
    }


    // Kun klikatun työvuorosta avautuvan popup-ikkunan Takaisin-nappia 
    // painetaan, suljetaan ikkuna asettamalla showEdit falseksi ja 
    // tyhjennetään popup-ikkunan kentät kutsumalla resetFields-funktiota: 
    const handleCancel = () => {
        setShowEdit(false)
        resetFields()
    }


    // Kun työvuorosta avautuvan popikkunan Tallenna-nappia painetaan, 
    // kutsutaan tätä funktiota. 
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        //This prevents the default html form submit from placing a ? at the end of the url fucking up the whole page :D
        e.preventDefault()
        // Haetaan kenttiin kirjoitetut työvuoron uusi alkamis- ja 
        // päättymisajankohta: 
        const shiftStartAndEnd = getStartAndEndTimes(workDate, startTime, endTime)

        // Jos kenttiin ei ole kirjoitettu, ei tehdä mitään vaan palataan 
        // tästä funktiosta: 
        if (shiftStartAndEnd == null) {
            return;
        }

        // Vuoro on aina suunniteltu. Meidän tietokannassa sen id on 2, 
        // mutta tähän voisi tehdä jonkin API-funktion, joka hakee vuoron 
        // id:n vuoron nimellä: 
        const reqBody: ShiftReq = {
            start_time: shiftStartAndEnd.start,
            end_time: shiftStartAndEnd.end,
            user_id: employeeId,
            shift_type_id: 2,
            description: description
        }

        // Muussa tapauksessa lähetetään suunnitellun vuoron 
        // ajankohtamuutokset service-funktion kautta backendille: 
        updateShift(selectedEventId, reqBody).then(() => {
            // Visualisoidaan muutokset myös kalenteriin:
            const calendarApi = calendarRef.current?.getApi()
            if (calendarApi) {
                calendarApi.getEventById(selectedEventId.toString())?.setStart(shiftStartAndEnd.start)
                calendarApi.getEventById(selectedEventId.toString())?.setEnd(shiftStartAndEnd.end)
                calendarApi.getEventById(selectedEventId.toString())?.setProp("title", description)
            } 
            // Nollataan sitten muut asiaan liittyvät tilamuuttujat: 
            setSelectedEventId(0)
            setShowEdit(false)
            resetFields()
        }).catch(error => {
            console.error("Tapahtui virhe: " + error)
            return;
        })
    }


    // Kun työvuorosta avautuvan popikkunan Poista-nappia painetaan, 
    // kutsutaan tätä funktiota, joka poistaa vuoron kutsumalla vuoron 
    // poistavaa service-funktiota:
    const handleRemove = () => {
        removeShift(selectedEventId).then(() => {
            // Visualisoidaan vuoron poisto myös kalenteriin:
            const calendarApi = calendarRef.current?.getApi()
            if (calendarApi) {
                calendarApi.getEventById(selectedEventId.toString())?.remove()
            }

            // Nollataan sitten muut asiaan liittyvät tilamuuttujat: 
            setSelectedEventId(0)
            setDeleteConfirmPopup(false)
            resetFields()
        })
    }


    return (
        <Calendar>
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
                dayHeaderContent={(args) => formatDayHeader(args.date)}
                locale={fiLocale}
                titleFormat={{
                    week: "short"
                }}
                weekText='Viikko'
            // weekNumbers={true}
            />
            {/* Delete shift pop up */}
            <ConfirmDeletePopup
                isOpen={deleteConfirmPopup}
                onConfirm={handleRemove}
                onCancel={closeDeletePopup}
                title="Poista vuoro"
                message={`Oletko varma että haluat poistaa tämän vuoron?`}
            />

            <Popup
                isOpen={showEdit}
                title="Muokkaa työvuoroa"
                width="500px"
                height="fit-content"
                onBackGroundClick={handleCancel}
            >
                <Form onSubmit={handleSave}>
                    <HourPicker
                        required={true}
                        value={startTime}
                        onChange={setStartTime}
                        placeholder="Aloitusaika"
                    />
                    <HourPicker
                        required={true}
                        value={endTime}
                        onChange={setEndTime}
                        placeholder="Lopetusaika"
                    />
                    <Textfield
                        required={false}
                        type="text"
                        value={description}
                        onChange={(e) => { setDescription(e.target.value) }}
                        maxLength={20}
                        placeholder={"Kuvaus, ei pakollinen"}
                    />
                    <Row>
                        <BlueButton onClick={handleCancel}>Takaisin</BlueButton>
                        <GreenButton type="submit">✓</GreenButton>
                    </Row>
                    <RedButton onClick={openDeletePopup}><DeleteIcon /></RedButton>
                </Form>
            </Popup>
        </Calendar>
    );
}
