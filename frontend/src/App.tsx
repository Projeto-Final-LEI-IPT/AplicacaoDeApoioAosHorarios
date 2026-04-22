import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import LoginPage from './pages/LoginPage.tsx'
import MainLayout from './Layout/MainLayout.tsx'
import PageNotFound from './pages/PageNotFound.tsx'
import HorarioPage from './pages/HorarioPage.tsx'
import SalasPage from './pages/SalasPage.tsx'
import ImportacaoPage from './pages/ImportacaoPage.tsx'
import DocentesPage from './pages/DocentesPage.tsx'
import UcsPage from './pages/UcsPage.tsx'
import TurmasPage from './pages/TurmasPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Páginas com navbar */}
          <Route path="/" element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            <Route path="horario" element={<HorarioPage />} />
            <Route path="salas" element={<SalasPage />} />
            <Route path="importar" element={<ImportacaoPage />} />
            <Route path="docentes" element={<DocentesPage />} />
            <Route path="cursos" element={<UcsPage />} />
            <Route path="turmas" element={<TurmasPage />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App