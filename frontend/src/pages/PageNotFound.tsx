import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000000',
    }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'rgb(4, 4, 4)' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
        Página não encontrada
      </h1>
      <p style={{ color: 'rgba(0, 0, 0, 0.5)', marginBottom: '32px' }}>
        A página que está à procura não existe.
      </p>
      <button
        onClick={() => navigate('/horario')}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          background: hover ? '#1f600ccc' : '#66aa22cc',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 24px',
          color: '#fff',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Voltar à página de Horários
      </button>
    </div>
  )
}