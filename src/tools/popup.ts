// Funktio tehty InspectEmployeePage.tsx-tiedostossa olevasta Antin koodista:
export function getStartAndEndTimes(date: Date | null, startTime: string, endTime: string) {
    
    if (!date || !startTime || !endTime) {
        //alert("Täytä kaikki kentät ennen tallennusta!");
        return null;
    }

    // Create the start and end date-time objects directly from the date and time values
    const startDateTime = new Date(date); // Convert selected date to a Date object
    const endDateTime = new Date(date); // Do the same for the end time
    
    // Set the time using the startTime and endTime strings
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    startDateTime.setHours(startHour, startMinute, 0, 0); // Set the start time correctly
    endDateTime.setHours(endHour, endMinute, 0, 0); // Set the end time correctly

    // Convert to ISO string to ensure correct format for API
    const startIsoString = startDateTime.toISOString();
    const endIsoString = endDateTime.toISOString();

    return {
        start: startIsoString, 
        end: endIsoString
    }
}