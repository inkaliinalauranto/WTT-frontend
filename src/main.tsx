import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import ManagerPage from './pages/ManagerPage.tsx'
import EmployeePage from './pages/EmployeePage.tsx'
import InspectEmployeePage from './pages/InspectEmployeePage.tsx'
import axios from 'axios'
import Cookies from 'js-cookie'
import NotFoundPage from './pages/NotFoundPage.tsx'

Cookies.set("wtt-token", "tähän register-endpointista FastAPI-docsin kautta saatava token")

// Asetetaam axiokselle rajapinnan baseURL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
const token = Cookies.get("wtt-token")
axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
// Sisällytetään kirjautumistiedot jokaiseen requestiin (otetaan evästeet mukaan)
axios.defaults.withCredentials = true


const router = createBrowserRouter([
  {
    path: "/",
    // @ts-ignore
    children: [
      {
        path: "/manager",
        element: <ManagerPage/>,
      },
      {
        path: "/employee",
        element: <EmployeePage/>
      },  
      {
        path: "/manager/inspect/",
        element: <InspectEmployeePage/>
      }
    ],
    errorElement: <NotFoundPage/>
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
  
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
