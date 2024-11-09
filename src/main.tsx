import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import ManagerPage from './pages/ManagerPage.tsx'
import EmployeePage from './pages/EmployeePage.tsx'
import InspectEmployeePage from './pages/InspectEmployeePage.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>,
    errorElement: <NotFoundPage/>
  },
  {
    path: "/manager",
    element: <ManagerPage/>
  },
  {
    path: "/employee",
    element: <EmployeePage/>
  },  
  {
    path: "/manager/inspect/",
    element: <InspectEmployeePage/>
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
