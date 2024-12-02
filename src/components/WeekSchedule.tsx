import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DatesSetArg, EventApi, EventInput } from '@fullcalendar/core';
import { useEffect, useState } from 'react';
import { getShifts, removeShift, updateShift } from '../services/shifts';
import { Calendar } from '../assets/css/calendar';
import fiLocale from "@fullcalendar/core/locales/fi"
import { snapshot } from 'valtio';
import { authStore } from '../store/authStore';
import { ShiftReq } from '../models/shifts';
import { EmployeeShift } from '../models/roles';
import { getStartAndEndTimes } from '../tools/popup';
import useWindowDimensions from '../hooks/windowDimensions';
import { InspectShiftPopup } from './InspectShiftPopup';
import { EditShiftPopup } from './EditShiftPopup';
import { DeleteShiftPopup } from './DeleteShiftPopup';


export function WeekSchedule({ employeeId, calendarRef, isAddPopupOpen }: EmployeeShift) {
    const { height, width } = useWindowDimensions();
    const [isLoading, setLoading] = useState(false)
    const [events, setEvents] = useState<EventInput[]>([])
    const [showManagerEdit, setShowManagerEdit] = useState(false)
    const [showEmployeeInspect, setShowEmployeeInspect] = useState(false)
    const [selectedEventId, setSelectedEventId] = useState(0)
    const [signedInUserSnap] = useState(snapshot(authStore))
    const [workDateStart, setWorkDateStart] = useState<Date | null>(null)
    const [workDateEnd, setWorkDateEnd] = useState<Date | null>(null)
    const [startTime, setStartTime] = useState("")
    const [endTime, setEndTime] = useState("")
    const [description, setDescription] = useState("")
    const [deleteConfirmPopup, setDeleteConfirmPopup] = useState(false)
    const [arg, setArg] = useState<DatesSetArg | null>(null)


    const openDeletePopup = () => {
        setShowManagerEdit(false)
        setDeleteConfirmPopup(true);
    }


    const closeDeletePopup = () => {
        setDeleteConfirmPopup(false)
    };


    // Haetaan suunnitellut vuorot ja lisätään ne EventInput-tietotyyppisinä 
    // events-tilamuuttujaan: 
    const setShiftsAsEvents = () => {
        getShifts(employeeId, "planned").then((shifts) => {
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


    // Kun vuoroa klikataan, tämä funktio avaa popup-ikkunan:
    const handleEventClick = (info: any) => {
        // Asetetaan klikatun vuoron aloitusaikaleima 
        // workDateStart-tilamuuttujaan: 
        setWorkDateStart(new Date(info.event.start))
        // Asetetaan klikatun vuoron lopetusaikaleima
        // workDateEnd-tilamuuttujaan: 
        setWorkDateEnd(new Date(info.event.end))
        // Asetetaan klikatun vuoron mahdollinen kuvaus 
        // description-tilamuuttujaan: 
        setDescription(info.event.title)

        if (signedInUserSnap.authUser.roleName === "manager") {
            // Jos käyttäjä on kirjautunut manager-roolilla sisään, avataan 
            // popup, jossa työvuoroa voi muokata tai sen voi poistaa: 
            setShowManagerEdit(true)
            // Asetetaan klikatun työvuoron id tilamuuttujaan, josta se 
            // voidaan noutaa, kun vuoroa päivitetään tai vuoro poistetaan: 
            setSelectedEventId(info.event.id)
            // Asetetaan klikatun vuoron aloitus- ja lopetuskellonajat start- ja 
            // endTime-muuttujiin, jolloin tiedot täyttyvät oletuksina 
            // popupin kenttiin, joiden kautta muokkaukset tehdään: 
            setStartTime((info.event.start).toTimeString().slice(0, 5))
            setEndTime((info.event.end).toTimeString().slice(0, 5))
        } else if (signedInUserSnap.authUser.roleName === "employee") {
            // Jos käyttäjä on kirjautunut employee-roolilla sisään, avataan 
            // popup, jossa työvuoroa voi muokata tai sen voi poistaa: 
            setShowEmployeeInspect(true)
        }
    }


    // Kutsutaan funktiota, joka "scrollaa" tarkasteltavan viikon aikaisimman 
    // työvuoron aloitusajankohtaan, kun vuorot haetaan kalenteriin tai kun 
    // ne rekisteröidään kalenterin API:iin, niiden muokkausten jälkeen tai 
    // vuoron lisäämisen jälkeen:
    useEffect(() => {
        scrollToEarliesShiftOfWeek()
    }, [events, arg, showManagerEdit, isAddPopupOpen, deleteConfirmPopup])


    // Funktion toimintalogiikan muodostamisessa on käytetty apuna ChatGPT:tä:
    const handleDatesSet = async (arg: DatesSetArg) => {
        // arg on objekti, jonka start- ja end-avaimet kertovat kalenterin 
        // näyttämän ajanjakson. Arvo vaihtuu aina, kun tarkasteltavaa 
        // ajanjaksoa eli viikkoa vaihdetaan eteen- tai taaksepäin:
        // console.log(arg)
        setArg(arg)
    }


    const scrollToEarliesShiftOfWeek = () => {
        const calendarApi = calendarRef.current?.getApi()
        // Kun kalenterin API on noutanut tarkasteltavan ajanjakson tiedot 
        // ja tämä tieto-objekti on asetettu arg-tilamuuttujaan, tehdään 
        // toiminnot, joilla "scrollataan" tarkasteltavan viikon aikaisimman 
        // vuoron aloitusajankohtaan:
        if (arg && calendarApi) {
            // Suodatetaan currentWeekShifts-muuttujaan vuorot, joiden 
            // aloitusajankohta on tarkasteltavalla viikolla:
            const currentWeekShifts: EventApi[] = calendarApi.getEvents().filter((shift) => {
                if (shift.start && shift.end && shift.start >= arg.start && shift.start < arg.end) {
                    // console.log("Täällä ollaan")
                    return shift
                }
            })

            // console.log("Viikon työvuorojen lukumäärä: " + currentWeekShifts.length)

            // Jos tarkasteltavalla viikolla ei ole vuoroja, palataan 
            // funktiosta, jolloin scrollauksen annetaan olla oletusarvossa 
            // eli ajassa 00:00:00 (määritelty kalenterin scrollTime-propsina)
            if (currentWeekShifts.length <= 0) {
                return;
            }

            // Muussa tapauksessa haetaan forEachin kautta scrollTime-
            // muuttujaan viikon aikaisimman vuoron aloitusaika:
            let scrollTime = "23:59:59"
            currentWeekShifts.forEach((shift) => {
                // Lähde toTimeString-metodin hyödyntämisestä slice-metodin 
                // kanssa, jotta aika saadaan HH:MM:SS-muotoon:
                // https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-221.php
                if (shift.start != null && shift.start.toTimeString().slice(0, 8) < scrollTime) {
                    scrollTime = shift.start!.toTimeString().slice(0, 8)
                }
            })

            // Asetetaan "scrollaus":
            calendarApi.scrollToTime(scrollTime)
        }
    }


    // Kun popup-ikkuna suljetaan, tyhjennetään tilamuuttujat, joissa 
    // pidetään lukua kenttien sisällöistä. Tätä ei kuitenkaan tarvita, 
    // koska aina uutta vuoro klikatessa avautuvaan ikkunaan asetetaan 
    // klikatun vuoron tiedot.
    /*
    const resetFields = () => {
        setWorkDate(null)
        setStartTime("")
        setEndTime("")
        setDescription("")
    }
    */


    // Kun työvuoron muokkaus-/poisto-popup-ikkunan Takaisin-nappia 
    // painetaan, suljetaan ikkuna asettamalla showManagerEdit falseksi: 
    const handleCancelManagerEdit = () => {
        setShowManagerEdit(false)
    }


    // Kun työvuoron tarkastelu-popup-ikkunan Takaisin-nappia painetaan, 
    // suljetaan ikkuna asettamalla showEmployeeInspect falseksi: 
    const handleCancelEmployeeInspect = () => {
        setShowEmployeeInspect(false)
    }


    // Kun työvuorosta avautuvan popikkunan Tallenna-nappia painetaan, 
    // kutsutaan tätä funktiota. 
    const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
        setLoading(true)
        //This prevents the default html form submit from placing a ? at the end of the url fucking up the whole page :D
        e.preventDefault()
        // Haetaan kenttiin kirjoitetut työvuoron uusi alkamis- ja 
        // päättymisajankohta: 
        const shiftStartAndEnd = getStartAndEndTimes(workDateStart, startTime, endTime)
        
        // Jos kenttiin ei ole kirjoitettu tai jos aloitusaika on samaan 
        // aikaan tai myöhemmin kuin lopetusaika, ei tehdä mitään vaan 
        // palataan tästä funktiosta:
        if (shiftStartAndEnd == null || shiftStartAndEnd.start >= shiftStartAndEnd.end) {
            setLoading(false)
            return;
        }

        // Alkuperäinen vuoro on aina suunniteltu, eikä sitä muuksi haluta 
        // muokkauksessa muuttaa, joten shift_type_id jätetty request bodysta 
        // pois. 
        const reqBody: ShiftReq = {
            start_time: shiftStartAndEnd.start,
            end_time: shiftStartAndEnd.end,
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
            setShowManagerEdit(false)
        }).catch(error => {
            console.error("Tapahtui virhe: " + error)
            setLoading(false)
            return;
        })
        setLoading(false)
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
        })
    }


    return (
        <Calendar style={{ overflowX: "auto" }}>
            <FullCalendar
                eventClick={handleEventClick}
                ref={calendarRef}
                datesSet={handleDatesSet}
                buttonText={{ today: "Tänään", week: "Viikko" }}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                events={events}
                nowIndicator={true}
                headerToolbar={{left: 'today', center: 'title', right: 'prev,next'}}
                height={height >= 860 ? 590 : height <= 600 ? 330 : height - 270}
                firstDay={1}
                scrollTime={"00:00:00"}
                allDaySlot={false}
                slotLabelFormat={{hour: 'numeric', minute: '2-digit'}}
                locale={fiLocale}
                titleFormat={{week: "short"}}
                weekText='Viikko'
            /* weekNumbers={true}*/ />

            {/* Delete shift pop up: */}
            <DeleteShiftPopup
                deleteConfirm={deleteConfirmPopup}
                close={closeDeletePopup}
                isLoading={isLoading}
                handleRemove={handleRemove} />

            <EditShiftPopup
                showPopup={showManagerEdit}
                handleCancel={handleCancelManagerEdit}
                handleSave={handleSave}
                startTime={startTime}
                setStartTime={setStartTime}
                setEndTime={setEndTime}
                endTime={endTime}
                description={description}
                setDescription={setDescription}
                width={width}
                openDeletePopup={openDeletePopup}
                isLoading={isLoading} />

            <InspectShiftPopup
                showPopup={showEmployeeInspect}
                handleCancel={handleCancelEmployeeInspect}
                workDateStart={workDateStart}
                workDateEnd={workDateEnd}
                description={description} />
        </Calendar>
    );
}
