import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/css/index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import ProtectedRoute from './components/ProtectedRoute.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'
import InspectEmployeePage from './pages/InspectEmployeePage.tsx'
import Dashboard from './pages/Dashboard.tsx'
import PublicRoute from './components/PublicRoute.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    // @ts-ignore,
    element: <ProtectedRoute><Dashboard/></ProtectedRoute>,
    errorElement: <NotFoundPage/>,
    children: [
      
    ]
  },
  {
    path: "/inspect",
    element: <InspectEmployeePage/>,
  },
  {
    path: "/login",
    element: <PublicRoute><LoginPage/></PublicRoute>,
  }
])


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
