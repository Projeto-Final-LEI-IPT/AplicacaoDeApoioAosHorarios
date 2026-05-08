import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function GestaoLayout() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      minHeight: 0,
    }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
