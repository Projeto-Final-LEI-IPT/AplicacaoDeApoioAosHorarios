import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// Lista de itens do menu lateral com a label visível e o path da rota correspondente
const menuItems = [
  { label: 'Horários', path: '/horario' },
  { label: 'Importar Excel', path: '/importar' },
  { label: 'Cursos e UCs', path: '/cursos' },
  { label: 'Docentes', path: '/docentes' },
  { label: 'Salas', path: '/salas' },
  { label: 'Turmas', path: '/turmas' },
  { label: 'Utilizadores', path: '/utilizadores' },
  { label: 'Auditoria', path: '/auditoria' },
]

export default function Sidebar() {
  // Navegar para outra página ao clicar num item do menu
  const navigate = useNavigate()

  // Obter a rota atual e destacar o item ativo
  const location = useLocation()

  // Estado para controlar qual item do menu está a ser passado com o rato (hover)
  const [hoveredPath, setHoveredPath] = useState<string | null>(null)

  return (
    <div style={{
      background: '#f1f5f9',
      padding: '8px 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '2px',
      borderRight: '1px solid #e2e8f0',
      fontFamily: 'system-ui, sans-serif',
    }}>

       {/* Renderiza um botão para cada item do menu */}
      {menuItems.map(item => {
        // Verifica se este item corresponde à página atual
        const ativo = location.pathname === item.path

        // Verifica se o rato está por cima deste item
        const hover = hoveredPath === item.path

        return (
          <button
            key={item.path}
            // Navega para a rota do item ao clicar no mesmo
            onClick={() => navigate(item.path)}
            // Regista o item com hover ao entrar com o rato e remove o hover ao sair
            onMouseEnter={() => setHoveredPath(item.path)}
            onMouseLeave={() => setHoveredPath(null)}
            style={{
              background: ativo ? '#e2e8f0' : hover ? '#e9eef5' : 'transparent',
              border: 'none',
              borderRadius: '0',
              padding: '10px 16px',
              color: ativo ? '#111' : '#555',
              fontWeight: ativo ? 600 : 400,
              fontSize: '0.95rem',
              fontFamily: 'inherit',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
              width: '100%',
            }}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}