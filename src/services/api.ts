// Haetaan base url envistä
const BASE_URL = import.meta.env.VITE_BASE_URL;


// Yleiskäyttöinen rajapintafunktio
export default async function wwtApi(endpoint: string, options = {}) {
  // Suoritetaan API request. Response voi mitä tahansa, 
  // koska kaikki apirequestifunktiot käyttää tätä.
  const response = await fetch(BASE_URL + endpoint, options)

  // Virheenkäsittelyt tähän, jotta requestit voidaan try catchaa
  // response.ok sisältää kaikki 2xx alkuiset responset.
  // 200 ok, 201 created, 202 accepted, 204 no content
  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('BadRequest');
    } else if (response.status === 401) {
      throw new Error('Unauthorized');
    } else if (response.status === 404) {
      throw new Error('NotFound');
    } else if (response.status === 500) {
      throw new Error('ServerError');
    } else {
      throw new Error(`Unexpected error: ${response.status}`);
    }
  }

  // Palautetaan data json muodossa.
  const data = await response.json()

  return data
}
  