import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.tsx'
import MainLayout from './Layout/MainLayout.tsx'
import PageNotFound from './pages/PageNotFound.tsx'
import HorarioPage from './pages/HorarioPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        {/*Páginas com navbar*/}
        <Route path="/horario" element={<MainLayout />}>
          <Route index element={<HorarioPage />} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App