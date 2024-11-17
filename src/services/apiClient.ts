// Generoitu chatgpt:llä ja muokattu
// axios client, jolle syötetään interceptor, 
// jotka toimii kaikissa axiosClientin kautta tehdyissä api requesteissa

import axios from "axios";
import Cookies from "js-cookie"


// Luodaan client
const axiosClient = axios.create({
    baseURL: "/api", // Set your base API URL
    timeout: 10000,  // Request timeout in milliseconds
});


// Request interceptor (optional, e.g., for authentication headers)
axiosClient.interceptors.request.use(
    (config) => {
        // Lisätään token jokaiseen requestiin mukaan
        const token = Cookies.get("wtt-token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Handle request error
        return Promise.reject(error);
    }
);


// Response interceptor
axiosClient.interceptors.response.use(
    (response) => {
        // Palautetaan response jos se on status 2xx
        return response;
    },
    (error) => {
        // Palautetaan virhe Error tyyppinä
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;

            // Palautetaan virheen statuskoodi Errorin mukana viestinä. Tälle on varmasti parempi tapa olemassa
            // mutta nyt mennään tälläisellä systeemillä.
            // Koodeihin pääsee käsiksi esimerkiksi näin:
            /*
            catch (e: unknown) {
                if (e instanceof Error) {
                    if (e.message == "401" || e.message == "404") {
                        authStore.error = "Invalid username or password"
                    } else {
                        authStore.error = e.message
                    }
                } 
                else {
                    authStore.error = "An unknown error occurred";
                }
            }
            */

            switch (status) {
                case 401:
                    // Unauthorized
                    return Promise.reject(new Error("401"));
                case 403:
                    // Forbidden
                    return Promise.reject(new Error("403"));
                case 404:
                    // Not found
                    return Promise.reject(new Error("404"));
                case 500:
                    // Internal Server Error
                    return Promise.reject(new Error("500"));
                default:
                    // Generic fallback for other errors
                    return Promise.reject(new Error(data.message || "An error occurred."));
            }
        } else if (error.request) {
            // Network or no response
            return Promise.reject(new Error("Network error: Please check your internet connection."));
        } else {
            // Other unknown errors
            return Promise.reject(new Error(error.message || "An unexpected error occurred."));
        }
    }
);


export default axiosClient;