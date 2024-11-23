import { scaleTime } from "@visx/scale";
import { Bar } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { theme } from "../assets/css/theme";
import { CardButton } from "../assets/css/cardButton";
import { ShiftRes } from "../models/shifts";
import { AuthUser } from "../models/auth";
import { useNavigate } from "react-router-dom";


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
    const barHeight = 12
    const linesHeight = 25
    const margin = { top: 8, right: 20, bottom: 8, left: 20 }
    const height = margin.top + margin.bottom + barHeight + linesHeight
    const width = 650

    // Näillä määritellään graafin piirto menneisyyteen ja tulevaisuuteen nykyhetkestä alkaen
    const fromHoursAgo = 5
    const toHoursIntoFuture = 8
    const now = new Date()
    const pastTime = floorTimeToHour(now)
    const futureTime = new Date()
    pastTime.setHours(now.getHours() - fromHoursAgo)
    futureTime.setHours(now.getHours() + toHoursIntoFuture)

    // Aikajanan scale
    const xScale = scaleTime({
        domain: [floorTimeToHour(pastTime), floorTimeToHour(futureTime)],
        range: [margin.left, width - margin.right],
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
            color = theme.plannedShift
        }
        else {color = theme.confirmedShift}
        
        // Luodaan itemi ja pusketaan se dataan
        const dataItem = {
            start: new Date(shiftList[i].start_time + ".000Z"),
            end: end,
            color: color,
        }
    
        data.push(dataItem)
    }

    // Siirretään plannedit listan alkuun, jotta ne piirtyy alimmaisena
    const reorderedData = data.sort((a, b) => {
        if (a.color === theme.plannedShift && b.color !== theme.plannedShift) return -1;
        if (a.color !== theme.plannedShift && b.color === theme.plannedShift) return 1;
        return 0; // Maintain order if types are the same
    });

    for (let i = 0; i < reorderedData.length; i++) {
        if (reorderedData[i].color == theme.plannedShift) {
            
            // Luodaan uusi bar graph, joka pusketaan dataan. Tämä piirtyy tuoreimpana kaikkien muiden päälle.
            const lateBar = {
                start: reorderedData[i].start,
                // Piirretään dataa vain plannedin ajan
                end: now > reorderedData[i].end ? reorderedData[i].end: now,
                color: theme.lateShift,
            }
            reorderedData.push(lateBar)
        }
    }

    // Siirretään confirmedit listan loppuun, jotta ne piirtyvät päällimäisenä
    const finalData = reorderedData.sort((a, b) => {
        if (a.color === theme.confirmedShift && b.color !== theme.confirmedShift) return 1;
        if (a.color !== theme.confirmedShift && b.color === theme.confirmedShift) return -1;
        return 0; // Maintain order if types are the same
    });


    // Luodaan employeen tiedoista nimi korttiin
    const employeeFullName = employee.first_name + " " + employee.last_name
 
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/inspect/${employee.id}`, { state: { employee } }); // Pass the employee object as state
      };


    return <CardButton onClick={handleCardClick}>
        <h3>{employeeFullName}</h3>
        <svg 
            viewBox={`0 0 ${width} ${height}`} // Defines the coordinate system
            style={{
                width: "100%",
                height: "auto", // Maintain aspectratio
            }}
        >   
            <AxisBottom
                scale={xScale}
                top={margin.top}
                stroke="#0000000"
                tickStroke={theme.gray20}
                tickLabelProps={() => ({
                    fill: theme.textBlack,
                    fontSize: 13,
                    textAnchor: "middle",
                    verticalAnchor: "middle"
                })}
                tickFormat={(d) => `${(d as Date).getHours()}`} // Format time
                tickLength={linesHeight}
            />
            {finalData.map((d, i) => (
                <Bar
                key={i}
                x={xScale(d.start)}
                y={margin.top + (linesHeight-barHeight) / 2}
                width={xScale(d.end) - xScale(d.start)}
                height={barHeight}
                fill={d.color}
                style={{ shapeRendering: "crispEdges" }}
                />
            ))}
         
        </svg>
        
    </CardButton>
}