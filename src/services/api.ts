// Haetaan base url envistä
const BASE_URL = import.meta.env.VITE_BASE_URL;


// Yleiskäyttöinen rajapintafunktio
export default async function wwtApi(endpoint: string, options = {}) {
  // Suoritetaan API request. Response voi mitä tahansa, 
  // koska kaikki apirequestifunktiot käyttää tätä.
  const response = await fetch(BASE_URL + endpoint, options)

  // Palautetaan data json muodossa.
  const data = await response.json()

  return data
}
  