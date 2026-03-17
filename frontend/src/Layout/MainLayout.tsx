import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout() {
  return (
    // Div principal que ocupa toda a altura do ecrã
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Navbar fixa no topo — presente em todas as páginas internas */}
      <Navbar />

      {/* Área de conteúdo — renderiza a página atual */}
      <main style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}