import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import GlobalProvider from './GlobalProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
)
