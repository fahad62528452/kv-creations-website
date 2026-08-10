import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import FoundersPage from './pages/Founders.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy.tsx'
import StudioPage from './studio/StudioPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/founders" element={<FoundersPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/studio" element={<StudioPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
