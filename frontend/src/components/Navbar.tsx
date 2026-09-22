import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { user } = useAuth() 
  
  // Hook para navegação programática
  const navigate = useNavigate()

  // Estado para controlar o hover do botão de logout
  const [hover, setHover] = useState(false)

  // Remove o token JWT e redireciona para a página de login
  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <nav style={{
      background: '#66aa22cc',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255,255,255,0.15)',
      padding: '0 32px',
      height: '64px',
      display: 'flex',
      position: 'sticky',
      top: 0,
      zIndex: 100, 
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'system-ui, sans-serif'
    }}>


      <div 
      onClick={() => navigate('/horario')}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor:"pointer" }}
      >
        <img src="/logo_ipt.jpg" alt="IPT" style={{ height: '37px' }} />
        <span style={{
          color: '#fff',
          fontSize: '1.25rem',
        }}>
          Planificação de Horários
        </span>
      </div>


      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{
          color: '#fff',
          fontSize: '1rem',
        }}>
          Utilizador autenticado ( {user?.nome} )
        </span>
        <button
          onClick={handleLogout}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            background: hover ? '#000000' : '#000000cc',
            transition: 'background 0.2s',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            color: '#fff',
            fontSize: '1.10rem',
            cursor: 'pointer'
          }}
        >
          Sair
        </button>
      </div>
    </nav>
  )
}