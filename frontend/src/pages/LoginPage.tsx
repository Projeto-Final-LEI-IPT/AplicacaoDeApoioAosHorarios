import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
// Hook para navegação programática
  const navigate = useNavigate()
  const { login } = useAuth()

  // Estados para controlar os campos de email, password, mensagem de erro e hover do botão
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [hover, setHover] = useState(false)

  // Função para validar os campos e simular o envio do formulário
  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault?.()
    if (!email || !password) {
      setError('Preenche todos os campos')
      return
    }

    try {
    // Faz o pedido ao backend
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError('Email ou palavra-passe incorretos')
      return
    }

    // Usa a função do contexto
    await login(data.access_token)

    // Redireciona para a página de horários
    setError('')
    navigate('/horario')

  } catch {
    setError('Erro ao ligar ao servidor. Tenta novamente.')
  }

  }
  
{/* Formulário de login */}
  return (
    <div style={{
      minHeight: '100vh',
      background: 'url(/background_right.png) right center / contain no-repeat', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      
      <div style={{
        background: ' #76BC21',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.13)',
        borderRadius: '16px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(152, 147, 147, 0)',
      }}>

        {/* Logotipo do IPT + nome da aplicação */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '180px', height: '100px',
            background: 'rgba(255, 255, 255, 0.32)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '16px',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem'
          }}><img
              src="/ipt_logo.jpg"
              alt="IPT"
              style={{
                objectFit: 'cover',
                height: '90px',
                width: '170px',
                borderRadius: '16px',
                display: 'block',
              }}
            /></div>
          <h1 style={{ color: '#000000', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
             Planificação de Horários
          </h1>
        </div>

        {/* Erro ao enviar o formulário */}
        {error && (
          <div style={{
            background: '#ef444422',
            border: '1px solid #ff0808',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ff0808',
            fontSize: '0.85rem',
            fontWeight: '500',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Campo de Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: '#000000', textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            EMAIL INSTITUCIONAL
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="utilizador@ipt.pt"
            style={{
              background: 'rgba(255,255,255,0.35)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '12px 14px',
              color: '#000000',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box' as const,
              width: '100%',
            }}
          />
        </div>

        {/* Campo de Palavra-Passe */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: '#000000', textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
            PALAVRA-PASSE
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            style={{
              background: 'rgba(255,255,255,0.35)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              padding: '12px 14px',
              color: '#000000',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box' as const,
              width: '100%',
            }}
          />
        </div>

        {/* Botão de Login */}
        <button
          onClick={handleSubmit}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: '100%',
            background: hover ? '#000000' : '#000000cc',  
            transition: 'background 0.2s',  
            border: 'none',
            borderRadius: '8px',
            padding: '13px',
            color: '#fff',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.5px'
          }}
        >
          ENTRAR
        </button>

      </div>
    </div>
  )
}