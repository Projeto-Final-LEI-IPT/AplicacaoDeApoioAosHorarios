import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PrivateRoute } from './components/PrivateRoute'
import LoginPage from './pages/LoginPage.tsx'
import MainLayout from './Layout/MainLayout.tsx'
import PageNotFound from './pages/PageNotFound.tsx'
import HorarioPage from './pages/HorarioPage.tsx'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />

          {/*Páginas com navbar*/}
          <Route path="/horario" element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }>
            <Route index element={<HorarioPage />} />
          </Route>

          {/* Página 404 */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App