import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PaperProvider } from './context/paperContext.jsx'
import { CurriculumProvider } from './context/curriculumContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaperProvider> 
    <CurriculumProvider>
      <App/>
    </CurriculumProvider>
    </PaperProvider>

  </StrictMode>,
)
