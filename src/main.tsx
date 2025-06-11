import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login.tsx'
import { Provider } from 'react-redux'
import { store } from './store/Store.ts'
import Dashboard from './pages/Dashboard.tsx'
import OrgGoals from './pages/OrgGoals.tsx'
import 'rsuite/dist/rsuite.min.css';  // or 'rsuite/styles/index.less';

import { CustomProvider } from 'rsuite';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomProvider theme="dark">
    <Provider store={store}>
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="org-goals" element={<OrgGoals />} />
      </Route>

    </Routes>
    </BrowserRouter>
    </Provider>
    </CustomProvider>
    </StrictMode>,
)
