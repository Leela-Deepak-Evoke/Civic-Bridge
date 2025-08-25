import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/montserrat/700.css';
import '@fontsource/poppins/400.css';
import '@fontsource/inter';
import LoaderProvider from './provider/Loader/LoaderProvider.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <BrowserRouter>
    <AuthProvider> 
      <LoaderProvider>
        <App />
      </LoaderProvider>
    </AuthProvider>
  </BrowserRouter>
</StrictMode>,
)
