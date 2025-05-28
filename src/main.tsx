import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/index.css'
import { HabitProvider } from './context/HabitContext'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <HabitProvider>
        <App />
      </HabitProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
