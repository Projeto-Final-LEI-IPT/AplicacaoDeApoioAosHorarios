import { useEffect, useState } from 'react'

// Tipo que representa uma sala
interface Sala {
  id: number
  nome: string
  capacidade: number
  tipo: string
}

export default function SalasPage() {
  const [salas, setSalas] = useState<Sala[]>([])
  const [nome, setNome] = useState('')
  const [capacidade, setCapacidade] = useState('')
  const [tipo, setTipo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  // Obtém o token do localStorage para autenticar os pedidos
  const token = localStorage.getItem('token')

  // Carrega todas as salas quando a página é aberta
  useEffect(() => {
    fetchSalas()
  }, [])

  const fetchSalas = async () => {
    const response = await fetch('http://localhost:3000/salas', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    setSalas(data)
  }

  const handleCriar = async () => {
    if (!nome || !capacidade || !tipo) {
      setErro('Preenche todos os campos')
      return
    }

    const response = await fetch('http://localhost:3000/salas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        capacidade: Number(capacidade),
        tipo,
      }),
    })

    if (response.ok) {
      setSucesso('Sala criada com sucesso')
      setErro('')
      setNome('')
      setCapacidade('')
      setTipo('')
      fetchSalas()
    } else {
      setErro('Erro ao criar sala')
    }
  }

  const handleApagar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/salas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      setSucesso('Sala apagada com sucesso')
      fetchSalas()
    } else {
      setErro('Erro ao apagar sala')
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        Gestão de Salas
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

      {/* Formulário para criar sala */}
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
            NOME
          </label>
          <input
            value={nome}
            onChange={e => setNome(e.target.value)}
            placeholder="Ex: B255"
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
            CAPACIDADE
          </label>
          <input
            type="number"
            value={capacidade}
            onChange={e => setCapacidade(e.target.value)}
            placeholder="Ex: 30"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '100px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            TIPO
          </label>
          <input
            value={tipo}
            onChange={e => setTipo(e.target.value)}
            placeholder="Ex: Laboratório"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
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
          Criar Sala
        </button>
      </div>

      {/* Tabela de salas */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Capacidade</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Tipo</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {salas.map(sala => (
            <tr key={sala.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>{sala.id}</td>
              <td style={{ padding: '12px' }}>{sala.nome}</td>
              <td style={{ padding: '12px' }}>{sala.capacidade}</td>
              <td style={{ padding: '12px' }}>{sala.tipo}</td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleApagar(sala.id)}
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
          {salas.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                Nenhuma sala encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}