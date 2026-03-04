import { useState } from 'react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [hover, setHover] = useState(false)

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault?.()
    if (!email || !password) {
      setError('Preenche todos os campos')
      return
    }
    setError('')
    alert('Login enviado — backend ainda não ligado')
  }
  

  return (
    <div style={{
      minHeight: '100vh',
      background: 'url(/ipt_background.png) center center / cover no-repeat',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'rgba(7, 39, 9, 0.26)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        borderRadius: '16px',
        padding: '48px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 8px 32px rgba(152, 147, 147, 0)',
      }}>

        {/* Logo / Título */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '150px', height: '100px',
            background: 'rgba(255, 255, 255, 0.32)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.4)',
            borderRadius: '16px',
            margin: '0 auto 16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.6rem'
          }}><img
              src="/ipt_logo.png"
              alt="IPT"
              style={{
                width: '120px',
                display: 'block',
              }}
            /></div>
          <h1 style={{ color: '#fff', fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
             Planificação de Horários
          </h1>
        </div>

        {/* Erro */}
        {error && (
          <div style={{
            background: '#ef444422',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ef4444',
            fontSize: '0.85rem',
            marginBottom: '20px'
          }}>
            {error}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
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
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box' as const,
              width: '100%',
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ color: 'rgba(255,255,255,0.95)', textShadow: '0 1px 3px rgba(0,0,0,0.5)', fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
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
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              boxSizing: 'border-box' as const,
              width: '100%',
            }}
          />
        </div>

        {/* Botão */}
        <button
          onClick={handleSubmit}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            width: '100%',
            background: hover ? '#15803d' : '#16a34a',
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