import { scaleTime } from "@visx/scale";
import { Bar } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { theme } from "../assets/css/theme";
import { Card } from "../assets/css/card";
import { ShiftRes } from "../models/shifts";
import { AuthUser } from "../models/auth";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { EmployeeCardRow } from "../assets/css/row";
import useWindowDimensions from "../hooks/windowDimensions";
import { ResponsiveSettings } from "../assets/css/responsive";


interface EmployeeCardProps {
    shiftList: Array<ShiftRes>
    employee: AuthUser
    scaleHours: number
    shiftCurrentHourPosition: number
    date: Date
    isWorking: boolean
}


export default function EmployeeCard({shiftList, employee, scaleHours, shiftCurrentHourPosition, date, isWorking}:EmployeeCardProps) {
    
    const { width } = useWindowDimensions();
    
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
    // Bottom margin muuttuu responsiividen takia 
    const bottomMargin = width <= parseInt(ResponsiveSettings.smallScreenMaxWidth.replace("px", ""),10)? 18 : 8
    const sideMargin = width <= parseInt(ResponsiveSettings.smallScreenMaxWidth.replace("px", ""),10)? 8 : 15
    const margin = { top: 8, right: sideMargin, bottom: bottomMargin, left: sideMargin }
    const cardHeight = margin.top + margin.bottom + barHeight + linesHeight
    const cardWidth = 650

    // Näillä määritellään graafin piirto menneisyyteen ja tulevaisuuteen nykyhetkestä alkaen
    const fromHoursAgo = scaleHours-shiftCurrentHourPosition
    const toHoursIntoFuture = scaleHours+shiftCurrentHourPosition
    const now = new Date()
    const pastTime = new Date(floorTimeToHour(date))
    const futureTime = new Date(date)
    pastTime.setHours(date.getHours() + fromHoursAgo)
    futureTime.setHours(date.getHours() - toHoursIntoFuture)

    // Piiretään kellon viiva vain tänään
    const clockTimeBar = now.getDate() == date.getDate()? now : 0

    // Aikajanan scale
    const xScale = scaleTime({
        domain: [pastTime, futureTime],
        range: [margin.left, cardWidth - margin.right],
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


    return <Card backgroundcolor={isWorking? theme.activeEmployee : theme.componentBg } onClick={handleCardClick}>
        <EmployeeCardRow>
            {isWorking? <AccountCircleIcon htmlColor={theme.activeEmployee}/> : <AccountCircleIcon htmlColor={theme.componentBg}/>}
            <h3>{employeeFullName}</h3>
        </EmployeeCardRow>
        <svg 
            viewBox={`0 0 ${cardWidth} ${cardHeight}`} // Defines the coordinate system
            style={{
                width: "100%",
                height: "auto", // Maintain aspectratio
            }}
        >
            <Bar
                x={xScale(clockTimeBar)}
                y={margin.top + (linesHeight-80) / 2}
                width={2}
                height={80}
                fill={theme.red}
                style={{ shapeRendering: "crispEdges" }}
            />
            <AxisBottom
                scale={xScale}
                top={margin.top}
                stroke="#0000000"
                tickStroke={theme.gray20}
                tickLabelProps={() => ({
                    fill: theme.textBlack,
                    fontSize: width <= parseInt(ResponsiveSettings.smallScreenMaxWidth.replace("px", ""),10)? 17 : 13,
                    textAnchor: "middle",
                    verticalAnchor: "middle"
                })}
                tickFormat={(d) => `${(d as Date).getHours()}${(d as Date).getMinutes()? ":30": ""}`} // Format time
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
    </Card>
}