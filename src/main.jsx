import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import App from './App.jsx'
import Router from './routes.jsx/Routes.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
   <RouterProvider router={Router} />
  </StrictMode>,
)
