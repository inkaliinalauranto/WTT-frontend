import { scaleTime } from "@visx/scale";
import { Bar } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { theme } from "../assets/css/theme";
import { CardButton } from "../assets/css/cardButton";
import { ShiftRes } from "../models/shifts";
import { AuthUser } from "../models/auth";


interface EmployeeCardProps {
    shiftList: Array<ShiftRes>
    employee: AuthUser
}


// @ts-ignore
export default function EmployeeCard({shiftList, employee}:EmployeeCardProps) {

    // Apufunktio pyöristämään kellonaika alaspäin tasatuntiin
    const floorTimeToHour = (date: Date): Date => {
        const roundedDate = new Date(date);
        // Reset minutes, seconds, and milliseconds to 0
        roundedDate.setMinutes(0, 0, 0);
        return roundedDate;
    };

    // Graafin layout mitat
    const barHeight = 15
    const linesHeight = 30
    const margin = { top: 8, right: 10, bottom: 8, left: 10 }
    const height = margin.top + margin.bottom + barHeight + linesHeight
    const width = 650

    // Näillä määritellään graafin piirto menneisyyteen ja tulevaisuuteen nykyhetkestä alkaen
    const fromHoursAgo = 6
    const toHoursIntoFuture = 6
    const now = new Date()
    const pastTime = floorTimeToHour(now)
    const futureTime = new Date()
    pastTime.setHours(now.getHours() - fromHoursAgo)
    futureTime.setHours(now.getHours() + toHoursIntoFuture)

    // Aikajanan scale
    const xScale = scaleTime({
        domain: [pastTime, futureTime],
        range: [10 + margin.left, width - margin.right],
    })

    // Data tulee apista siten, että se hakee kaikki työvuorot, planned ja confirmed
    // ja ne järjestetään start_timen mukaan vanhin aika ensin. Se vuoro, jolla ei ole
    // End timeä, pitäisi olla viimeisenä listassa, koska tämä piirtää graafia
    // käyttäjän current localtimeen asti.

    // Alustetaan data lista
    const data = []


    // Täytetään lista backendistä saadulla datalla, jos sitä on.
    for (let i = 0; i < shiftList.length; i++) {

        // Päättymisaika graafille on oletuksena lokaali nykyhetki
        let end;
        // Jos endTime löytyy, käytetään sitä.
        if (shiftList[i].end_time !== null) {
            end = new Date(shiftList[i].end_time + ".000Z")
        } 
        else { end = now }

        // Määritellään oletuksena väri siniseksi.
        let color;
        // Jos työvuoron tyyppi on confirmed eli id 2, väri on vihreä
        if (shiftList[i].shift_type_id == 2) {
            color = theme.blue
        }
        else {color = theme.green}
        
        // Luodaan itemi ja pusketaan se dataan
        const dataItem = {
            start: new Date(shiftList[i].start_time + ".000Z"),
            end: end,
            color: color,
        }
    
        data.push(dataItem)
    }


    // Luodaan employeen tiedoista nimi korttiin
    const employeeFullName = employee.first_name + " " + employee.last_name
 

    function openInspectEmployeePage() {
        console.log("Tarkastele työntekijää id:llä " + employee.id)
    }


    return <CardButton onClick={openInspectEmployeePage}>
        <h3>{employeeFullName}</h3>
        <svg width={width} height={height}>
            <AxisBottom
                scale={xScale}
                top={margin.top}
                stroke="#0000000"
                tickStroke={theme.statLines}
                tickLabelProps={() => ({
                    fill: theme.textBlack,
                    fontSize: 13,
                    textAnchor: "middle",
                    verticalAnchor: "middle",
                })}
                tickFormat={(d) => `${(d as Date).getHours()}`} // Format time
                tickLength={linesHeight}
            />
            {data.map((d, i) => (
                <Bar
                key={i}
                x={xScale(d.start)}
                y={margin.top + (linesHeight-barHeight) / 2}
                width={xScale(d.end) - xScale(d.start)}
                height={barHeight}
                fill={d.color}
                />
            ))}
        </svg>
        
    </CardButton>
}