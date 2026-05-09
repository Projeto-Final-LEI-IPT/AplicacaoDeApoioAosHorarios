import { useState, useEffect } from 'react'

export default function ImportacaoPage() {
  const [ficheiro, setFicheiro] = useState<File | null>(null)
  const [resultado, setResultado] = useState<any>(null)
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const [limpando, setLimpando] = useState(false)
  const [confirmarLimpeza, setConfirmarLimpeza] = useState(false)
  const [sucesso, setSucesso] = useState('')

  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!sucesso) return
    const timer = setTimeout(() => setSucesso(''), 3000)
    return () => clearTimeout(timer)
  }, [sucesso])

  const handleFicheiro = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFicheiro(e.target.files[0])
      setResultado(null)
      setErro('')
    }
  }

  const handleLimpar = async () => {
    setLimpando(true)
    setErro('')
    try {
      const response = await fetch('http://localhost:3000/importacao', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        setResultado(null)
        setFicheiro(null)
        setConfirmarLimpeza(false)
        setSucesso('Dados eliminados com sucesso.')
      } else {
        setErro('Erro ao limpar os dados')
      }
    } catch {
      setErro('Erro ao ligar ao servidor')
    } finally {
      setLimpando(false)
    }
  }

  const handleImportar = async () => {
    if (!ficheiro) {
      setErro('Seleciona um ficheiro Excel')
      return
    }

    setLoading(true)
    setErro('')

    const formData = new FormData()
    formData.append('file', ficheiro)

    try {
      const response = await fetch('http://localhost:3000/importacao', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        setResultado(data)
      } else {
        setErro('Erro ao importar ficheiro')
      }
    } catch {
      setErro('Erro ao ligar ao servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>
        Importação de Ficheiros Excel
      </h1>

      {/* Área de upload */}
      <div style={{
        background: '#f1f5f9',
        borderRadius: '12px',
        padding: '32px',
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        border: '2px dashed #e2e8f0',
      }}>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Seleciona um ficheiro Excel (.xlsx) com as folhas: Cursos, Docentes, Turmas e UCs
        </p>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleFicheiro}
          style={{ fontSize: '0.9rem' }}
        />

        {ficheiro && (
          <p style={{ color: '#16a34a', fontSize: '0.85rem' }}>
            Ficheiro selecionado: {ficheiro.name}
          </p>
        )}

        <button
          onClick={handleImportar}
          disabled={loading}
          style={{
            background: loading ? '#94a3b8' : '#16a34a',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 24px',
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'A importar...' : 'Importar'}
        </button>
      </div>

      {/* Limpar dados */}
      <div style={{
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        padding: '20px 24px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap',
      }}>
        <div>
          <p style={{ fontWeight: 600, color: '#991b1b', fontSize: '0.9rem', marginBottom: '2px' }}>
            Limpar todos os dados importados
          </p>
          <p style={{ color: '#b91c1c', fontSize: '0.8rem' }}>
            Remove cursos, docentes, turmas, UCs e blocos existentes.
          </p>
        </div>

        {!confirmarLimpeza ? (
          <button
            onClick={() => setConfirmarLimpeza(true)}
            style={{
              background: '#ef4444',
              border: 'none',
              borderRadius: '8px',
              padding: '9px 20px',
              color: '#fff',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Limpar Dados
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', color: '#991b1b', fontWeight: 500 }}>
              Tens a certeza?
            </span>
            <button
              onClick={handleLimpar}
              disabled={limpando}
              style={{
                background: limpando ? '#94a3b8' : '#ef4444',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 16px',
                color: '#fff',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: limpando ? 'not-allowed' : 'pointer',
              }}
            >
              {limpando ? 'A limpar...' : 'Confirmar'}
            </button>
            <button
              onClick={() => setConfirmarLimpeza(false)}
              disabled={limpando}
              style={{
                background: '#e2e8f0',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 16px',
                color: '#374151',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>

      {/* Notificação de sucesso */}
      {sucesso && (
        <div style={{
          background: '#dcfce7',
          border: '1px solid #16a34a',
          borderRadius: '8px',
          padding: '10px 14px',
          color: '#15803d',
          fontSize: '0.85rem',
          fontWeight: 500,
          marginBottom: '16px',
        }}>
          {sucesso}
        </div>
      )}

      {/* Erro */}
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

      {/* Resultado da importação */}
      {resultado && (
        <div style={{
          background: '#f1f5f9',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px' }}>
            Resultado da Importação
          </h2>

          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Cursos', valor: resultado.cursos },
              { label: 'Docentes', valor: resultado.docentes },
              { label: 'Turmas', valor: resultado.turmas },
              { label: 'UCs', valor: resultado.ucs },
            ].map(item => (
              <div key={item.label} style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '16px 24px',
                textAlign: 'center',
                border: '1px solid #e2e8f0',
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#16a34a' }}>
                  {item.valor}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Erros da importação */}
          {resultado.erros && resultado.erros.length > 0 && (
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px', color: '#ef4444' }}>
                Erros encontrados:
              </h3>
              {resultado.erros.map((erro: string, index: number) => (
                <div key={index} style={{
                  background: '#fee2e2',
                  borderRadius: '6px',
                  padding: '8px 12px',
                  color: '#ef4444',
                  fontSize: '0.85rem',
                  marginBottom: '4px',
                }}>
                  {erro}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}