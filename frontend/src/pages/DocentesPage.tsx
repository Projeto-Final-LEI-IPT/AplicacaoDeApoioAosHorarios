import { useEffect, useState } from 'react'

// Tipo que representa um docente
interface Docente {
  id: number
  nome: string
  email: string
  maxHorasDia: number
}

export default function DocentesPage() {
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [maxHorasDia, setMaxHorasDia] = useState('8')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const token = localStorage.getItem('token')

  // Carrega todos os docentes quando a página é aberta
  useEffect(() => {
    fetchDocentes()
  }, [])

  const fetchDocentes = async () => {
    const response = await fetch('http://localhost:3000/docentes', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    setDocentes(data)
  }

  const handleCriar = async () => {
    if (!nome || !email) {
      setErro('Preenche todos os campos obrigatórios')
      return
    }

    const response = await fetch('http://localhost:3000/docentes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        email,
        maxHorasDia: Number(maxHorasDia),
      }),
    })

    if (response.ok) {
      setSucesso('Docente criado com sucesso')
      setErro('')
      setNome('')
      setEmail('')
      setMaxHorasDia('8')
      fetchDocentes()
    } else {
      setErro('Erro ao criar docente')
    }
  }

  const handleApagar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/docentes/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      setSucesso('Docente apagado com sucesso')
      fetchDocentes()
    } else {
      setErro('Erro ao apagar docente')
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        Gestão de Docentes
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

      {/* Formulário para criar docente */}
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
            MÁX. HORAS/DIA
          </label>
          <input
            type="number"
            value={maxHorasDia}
            onChange={e => setMaxHorasDia(e.target.value)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '80px',
            }}
          />
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
          Criar Docente
        </button>
      </div>

      {/* Tabela de docentes */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Máx. Horas/Dia</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map(docente => (
            <tr key={docente.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>{docente.id}</td>
              <td style={{ padding: '12px' }}>{docente.nome}</td>
              <td style={{ padding: '12px' }}>{docente.email}</td>
              <td style={{ padding: '12px' }}>{docente.maxHorasDia}</td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleApagar(docente.id)}
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
          {docentes.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                Nenhum docente encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}