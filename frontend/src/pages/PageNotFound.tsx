import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  // Hook para navegação programática
  const navigate = useNavigate()

  // Estado para controlar o hover do botão
  const [hover, setHover] = useState(false)

  return (
    // Container centralizado com mensagem de erro e botão para voltar à página de horários
    <div style={{
      minHeight: '100vh',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#000000',
    }}>
      {/* Mensagem de erro 404 grande e em negrito */}
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'rgb(4, 4, 4)' }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
        Página não encontrada
      </h1>
      <p style={{ color: 'rgba(0, 0, 0, 0.5)', marginBottom: '32px' }}>
        A página que está à procura não existe.
      </p>
      
      {/* Botão para voltar à página de horários */}
      <button
        // Navega para a página de horários ao clicar no botão
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