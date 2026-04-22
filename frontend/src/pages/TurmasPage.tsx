import { useEffect, useState } from 'react'

// Tipo que representa uma turma
interface Turma {
  id: number
  nome: string
  ano: number
  semestre: number
  curso: {
    id: number
    nome: string
  }
}

// Tipo que representa um curso para o dropdown
interface Curso {
  id: number
  nome: string
}

export default function TurmasPage() {
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [nome, setNome] = useState('')
  const [ano, setAno] = useState('1')
  const [semestre, setSemestre] = useState('1')
  const [cursoId, setCursoId] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchTurmas()
    fetchCursos()
  }, [])

  const fetchTurmas = async () => {
    const response = await fetch('http://localhost:3000/turmas', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    setTurmas(data)
  }

  const fetchCursos = async () => {
    const response = await fetch('http://localhost:3000/cursos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    setCursos(data)
  }

  const handleCriar = async () => {
    if (!nome || !cursoId) {
      setErro('Preenche todos os campos obrigatórios')
      return
    }

    const response = await fetch('http://localhost:3000/turmas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        ano: Number(ano),
        semestre: Number(semestre),
        cursoId: Number(cursoId),
      }),
    })

    if (response.ok) {
      setSucesso('Turma criada com sucesso')
      setErro('')
      setNome('')
      setAno('1')
      setSemestre('1')
      setCursoId('')
      fetchTurmas()
    } else {
      setErro('Erro ao criar turma')
    }
  }

  const handleApagar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/turmas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      setSucesso('Turma apagada com sucesso')
      fetchTurmas()
    } else {
      setErro('Erro ao apagar turma')
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        Gestão de Turmas
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

      {/* Formulário para criar turma */}
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
            placeholder="Ex: Turma A"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '150px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            ANO
          </label>
          <select
            value={ano}
            onChange={e => setAno(e.target.value)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              background: '#fff',
            }}
          >
            <option value="1">1º Ano</option>
            <option value="2">2º Ano</option>
            <option value="3">3º Ano</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            SEMESTRE
          </label>
          <select
            value={semestre}
            onChange={e => setSemestre(e.target.value)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              background: '#fff',
            }}
          >
            <option value="1">1º Semestre</option>
            <option value="2">2º Semestre</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            CURSO *
          </label>
          <select
            value={cursoId}
            onChange={e => setCursoId(e.target.value)}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              background: '#fff',
              width: '200px',
            }}
          >
            <option value="">Selecionar curso</option>
            {cursos.map(curso => (
              <option key={curso.id} value={curso.id}>
                {curso.nome}
              </option>
            ))}
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
          Criar Turma
        </button>
      </div>

      {/* Tabela de turmas */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ano</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Semestre</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Curso</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {turmas.map(turma => (
            <tr key={turma.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>{turma.id}</td>
              <td style={{ padding: '12px' }}>{turma.nome}</td>
              <td style={{ padding: '12px' }}>{turma.ano}º</td>
              <td style={{ padding: '12px' }}>{turma.semestre}º</td>
              <td style={{ padding: '12px' }}>{turma.curso?.nome}</td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleApagar(turma.id)}
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
          {turmas.length === 0 && (
            <tr>
              <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                Nenhuma turma encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}