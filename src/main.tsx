import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/hanken-grotesk'
import '@fontsource/eb-garamond/400.css'
import '@fontsource/eb-garamond/400-italic.css'
import '@fontsource/eb-garamond/500.css'
import './index.css'
import App from './App'
import { AppProvider } from './state/app'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
