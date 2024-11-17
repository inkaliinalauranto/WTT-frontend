import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import InspectEmployeePage from './pages/InspectEmployeePage.tsx'
import Dashboard from './pages/Dashboard.tsx'

/*
// Asetetaam axiokselle rajapinnan baseURL
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
const token = Cookies.get("wtt-token")
axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
// Sisällytetään kirjautumistiedot jokaiseen requestiin (otetaan evästeet mukaan)
axios.defaults.withCredentials = true
axios.defaults.
*/

const router = createBrowserRouter([
  {
    path: "/",
    // @ts-ignore,
    element: <ProtectedRoute><Dashboard/></ProtectedRoute>,
    errorElement: <NotFoundPage/>,
    children: [
      {
        path: "/inspect",
        element: <InspectEmployeePage/>,
      },
      {
        path: "/login",
        element: <LoginPage/>,
      }
    ]
  },

])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
