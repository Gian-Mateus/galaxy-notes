import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { AppSidebar } from './components/sidebar/app-sidebar.tsx'
import { SidebarProvider } from './components/sidebar/sidebar.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SidebarProvider>
      <BrowserRouter>
        <AppSidebar/>
        <App />
      </BrowserRouter>
    </SidebarProvider>
  </StrictMode>,
)
