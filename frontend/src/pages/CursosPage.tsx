import { useEffect, useState } from 'react'

// Tipo que representa um curso
interface Curso {
  id: number
  nome: string
  tipo: 'SEMESTRAL' | 'MODULAR'
  anoLetivo: string
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [nome, setNome] = useState('')
  const [tipo, setTipo] = useState<'SEMESTRAL' | 'MODULAR'>('SEMESTRAL')
  const [anoLetivo, setAnoLetivo] = useState('2025/2026')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const token = localStorage.getItem('token')

  // Carrega todos os cursos quando a página é aberta
  useEffect(() => {
    fetchCursos()
  }, [])

  const fetchCursos = async () => {
    const response = await fetch('http://localhost:3000/cursos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    setCursos(data)
  }

  const handleCriar = async () => {
    if (!nome || !anoLetivo) {
      setErro('Preenche todos os campos obrigatórios')
      return
    }

    const response = await fetch('http://localhost:3000/cursos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nome, tipo, anoLetivo }),
    })

    if (response.ok) {
      setSucesso('Curso criado com sucesso')
      setErro('')
      setNome('')
      setTipo('SEMESTRAL')
      setAnoLetivo('2025/2026')
      fetchCursos()
    } else {
      setErro('Erro ao criar curso')
    }
  }

  const handleApagar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/cursos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      setSucesso('Curso apagado com sucesso')
      fetchCursos()
    } else {
      setErro('Erro ao apagar curso')
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        Gestão de Cursos
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

      {/* Formulário para criar curso */}
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
            placeholder="Ex: Engenharia Informática"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '250px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            TIPO
          </label>
          <select
            value={tipo}
            onChange={e => setTipo(e.target.value as 'SEMESTRAL' | 'MODULAR')}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              background: '#fff',
            }}
          >
            <option value="SEMESTRAL">Semestral</option>
            <option value="MODULAR">Modular</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            ANO LETIVO *
          </label>
          <input
            value={anoLetivo}
            onChange={e => setAnoLetivo(e.target.value)}
            placeholder="Ex: 2025/2026"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '120px',
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
          Criar Curso
        </button>
      </div>

      {/* Tabela de cursos */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Tipo</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ano Letivo</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>{curso.id}</td>
              <td style={{ padding: '12px' }}>{curso.nome}</td>
              <td style={{ padding: '12px' }}>{curso.tipo}</td>
              <td style={{ padding: '12px' }}>{curso.anoLetivo}</td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleApagar(curso.id)}
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
          {cursos.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                Nenhum curso encontrado
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}