import { useEffect, useState } from 'react'

type Role = 'ADMIN' | 'COMISSAO_ESCOLA' | 'COMISSAO_CURSO' | 'DOCENTE'

// Tipo que representa um utilizador (user) do sistema
interface User {
  id: number
  nome: string
  email: string
  role: Role
}

const verifyEmail = (email: string) => {
  return email.endsWith('@ipt.pt')
}


export default function UsersPage() {
  const [utilizadores, setUtilizadores] = useState<User[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('DOCENTE') // Valor padrão para role
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const token = localStorage.getItem('token')

  const mostrarErro = (msg: string) => { setErro(msg); setTimeout(() => setErro(''), 2000) }
  const mostrarSucesso = (msg: string) => { setSucesso(msg); setTimeout(() => setSucesso(''), 2000) }

  // Carrega todos os utilizadores quando a página é aberta
  useEffect(() => {
    fetchUtilizadores()
  }, [])

  const fetchUtilizadores = async () => {
    const response = await fetch('http://localhost:3000/users', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) {
      mostrarErro('Erro ao carregar utilizadores')
      return
    }
    const data = await response.json()
    setUtilizadores(data)
  }

  const handleCriar = async () => {
    if (!nome || !email) {
      mostrarErro('Preenche todos os campos obrigatórios')
      return
    }

    if (!verifyEmail(email)) {
      mostrarErro('Por favor, insira um email que termine com "@ipt.pt"')
      return
    }

    if (utilizadores.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      mostrarErro(`Já existe um utilizador com o email "${email}"`)
      return
    }

    const response = await fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        email,
        password,
        role, 
      }),
    })

    if (response.ok) {
      mostrarSucesso('Utilizador criado com sucesso')
      setNome('')
      setEmail('')
      setRole('DOCENTE')
      setPassword('')
      fetchUtilizadores()
    } else {
      const data = await response.json()
      mostrarErro(data.message || 'Erro ao criar utilizador')
    }
  }

  const handleApagar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      mostrarSucesso('Utilizador apagado com sucesso')
      fetchUtilizadores()
    } else {
      mostrarErro('Erro ao apagar utilizador')
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        Gestão de Utilizadores
      </h1>

      {/* Mensagens de erro e sucesso */}
      {erro && (
        <div style={{
          background: '#fee2e2',
          border: '1px solid #ef4444',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#ef4444',
          marginBottom: '16px',
        }}>
          {erro}
        </div>
      )}
      {sucesso && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#16a34a',
          marginBottom: '16px',
        }}>
          {sucesso}
        </div>
      )}

      {/* Formulário para criar utilizador */}
      <div style={{
        background: '#f1f5f9',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '32px',
        display: 'flex',
        gap: '12px',
        alignItems: 'flex-end',
        flexWrap: 'wrap',
      }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            NOME *
          </label>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: João Silva"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            PASSWORD *
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            EMAIL *
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Ex: joao.silva@ipt.pt"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '220px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            Role
          </label>
          <select
            value={role}
            onChange={e => setRole(e.target.value as Role)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '80px',
            }}
          >
            <option value="DOCENTE">Docente</option>
            <option value="ADMIN">Admin</option>
            <option value="COMISSAO_ESCOLA">Comissão de Escola</option>
            <option value="COMISSAO_CURSO">Comissão de Curso</option>
    </select>
        </div>

        <button
          onClick={handleCriar}
          style={{
            background: '#16a34a',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 20px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Criar Utilizador
        </button>
      </div>

      {/* Tabela de utilizadores */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Role</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {utilizadores.map(utilizador => (
            <tr key={utilizador.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>{utilizador.id}</td>
              <td style={{ padding: '12px' }}>{utilizador.nome}</td>
              <td style={{ padding: '12px' }}>{utilizador.email}</td>
              <td style={{ padding: '12px' }}>{utilizador.role}</td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleApagar(utilizador.id)}
                  style={{
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                  }}
                >
                  Apagar
                </button>
              </td>
            </tr>
          ))}
          {utilizadores.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                Nenhum utilizador encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}