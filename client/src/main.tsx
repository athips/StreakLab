import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './streakos4.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
