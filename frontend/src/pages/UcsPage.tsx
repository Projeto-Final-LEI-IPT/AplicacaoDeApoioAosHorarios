import { useEffect, useState } from 'react'

// Tipo que representa uma unidade curricular
interface UC {
  id: number
  nome: string
  codigo: string
  semestre: number
  horasContacto: number
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

export default function UcsPage() {
  const [ucs, setUcs] = useState<UC[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [nome, setNome] = useState('')
  const [codigo, setCodigo] = useState('')
  const [semestre, setSemestre] = useState('1')
  const [horasContacto, setHorasContacto] = useState('')
  const [cursoId, setCursoId] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchUcs()
    fetchCursos()
  }, [])

  const fetchUcs = async () => {
    const response = await fetch('http://localhost:3000/ucs', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    setUcs(data)
  }

  const fetchCursos = async () => {
    const response = await fetch('http://localhost:3000/cursos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    setCursos(data)
  }

  const handleCriar = async () => {
    if (!nome || !codigo || !horasContacto || !cursoId) {
      setErro('Preenche todos os campos obrigatórios')
      return
    }

    const response = await fetch('http://localhost:3000/ucs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nome,
        codigo,
        semestre: Number(semestre),
        horasContacto: Number(horasContacto),
        cursoId: Number(cursoId),
      }),
    })

    if (response.ok) {
      setSucesso('UC criada com sucesso')
      setErro('')
      setNome('')
      setCodigo('')
      setSemestre('1')
      setHorasContacto('')
      setCursoId('')
      fetchUcs()
    } else {
      setErro('Erro ao criar UC')
    }
  }

  const handleApagar = async (id: number) => {
    const response = await fetch(`http://localhost:3000/ucs/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      setSucesso('UC apagada com sucesso')
      fetchUcs()
    } else {
      setErro('Erro ao apagar UC')
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        Gestão de Unidades Curriculares
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

      {/* Formulário para criar UC */}
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
            placeholder="Ex: Programação"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '200px',
            }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>
            CÓDIGO *
          </label>
          <input
            value={codigo}
            onChange={e => setCodigo(e.target.value)}
            placeholder="Ex: PRG101"
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.9rem',
              width: '120px',
            }}
          />
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
            HORAS CONTACTO *
          </label>
          <input
            type="number"
            value={horasContacto}
            onChange={e => setHorasContacto(e.target.value)}
            placeholder="Ex: 60"
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
          Criar UC
        </button>
      </div>

      {/* Tabela de UCs */}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f1f5f9' }}>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>ID</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Nome</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Código</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Semestre</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Horas Contacto</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Curso</th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #e2e8f0' }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {ucs.map(uc => (
            <tr key={uc.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
              <td style={{ padding: '12px' }}>{uc.id}</td>
              <td style={{ padding: '12px' }}>{uc.nome}</td>
              <td style={{ padding: '12px' }}>{uc.codigo}</td>
              <td style={{ padding: '12px' }}>{uc.semestre}º</td>
              <td style={{ padding: '12px' }}>{uc.horasContacto}h</td>
              <td style={{ padding: '12px' }}>{uc.curso?.nome}</td>
              <td style={{ padding: '12px' }}>
                <button
                  onClick={() => handleApagar(uc.id)}
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
          {ucs.length === 0 && (
            <tr>
              <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                Nenhuma UC encontrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}