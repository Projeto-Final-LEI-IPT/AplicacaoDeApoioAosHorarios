import { useEffect, useRef, useState, useMemo } from 'react'
import Sidebar from "../components/Sidebar"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { useAuth } from '../hooks/useAuth'

interface UC {
  id: number
  nome: string
  codigo: string
  horasContacto: number
  semestre: number
  curso: { id: number; nome: string }
}

interface Turma {
  id: number
  nome: string
  ano: number
  semestre: number
  curso: { id: number; nome: string }
}

interface Sala {
  id: number
  nome: string
}

interface Docente {
  id: number
  nome: string
}

interface Bloco {
  id: number
  tipologia: string
  data: string
  horaInicio: string
  horaFim: string
  uc: any
  docente: any
  sala: any
  turma: any 
}

type Vista = 'turma' | 'docente' | 'sala'

export default function HorarioPage() {
  const { user } = useAuth()
  console.log('Utilizador autenticado:', user)

  const [larguraJanela, setLarguraJanela] = useState(window.innerWidth)
  const [ucs, setUcs] = useState<UC[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [vista, setVista] = useState<Vista>('turma')
  const [filtroCurso, setFiltroCurso] = useState('')
  const [blocosColocados, setBlocosColocados] = useState<Set<string>>(new Set())
  const [blocosGravados, setBlocosGravados] = useState<Bloco[]>([])
  const [docentes, setDocentes] = useState<Docente[]>([])
  const [salas, setSalas] = useState<Sala[]>([])
  const [dialogAberto, setDialogAberto] = useState(false)
  const [dadosDrop, setDadosDrop] = useState<{ ucId: number; turmaId: number; ucNome: string; turmaNome: string; dataDrop : string; horaInicio:string ; horaFim:string} | null>(null)
  const [tipologiaEscolhida, setTipologiaEscolhida] = useState('')
  const [docenteEscolhido, setDocenteEscolhido] = useState('')
  const [salaEscolhida, setSalaEscolhida] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)
  const painelDireitoRef = useRef<HTMLDivElement>(null)
  const calendarRef = useRef<FullCalendar>(null)
  const eventoPendenteRef = useRef<any>(null)
  const token = localStorage.getItem('token')
  const [feriados, setFeriados] = useState<{ nome: string; data: string }[]>([])
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear())
  const [semanaLabel, setSemanaLabel] = useState('')


  useEffect(() => {
    const handleResize = () => setLarguraJanela(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchDados = async () => {
      const [ucsRes, turmasRes, salasRes, docentesRes] = await Promise.all([
        fetch('http://localhost:3000/ucs', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3000/turmas', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3000/salas', {headers: { Authorization: `Bearer ${token}` }}),
        fetch('http://localhost:3000/docentes', {headers:{ Authorization: `Bearer ${token}` }})
      ])
      setUcs(await ucsRes.json())
      setTurmas(await turmasRes.json())
      setSalas(await salasRes.json())
      setDocentes(await docentesRes.json())
    }
    fetchDados()
  }, [])

const fetchBlocos = async () => {
  const res = await fetch('http://localhost:3000/blocos', { headers: { Authorization: `Bearer ${token}` } })
  const dados = await res.json()
  setBlocosGravados(dados)
}

useEffect(() => {
  fetchBlocos()
}, [])

  useEffect(() => {
    const fetchFeriados = async () => {
      const res = await fetch(`http://localhost:3000/feriados?ano=${anoAtual}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) setFeriados(await res.json())
    }
    fetchFeriados()
  }, [anoAtual])


  // Inicializa o Draggable do FullCalendar no contentor dos blocos.
  // Re-inicializa sempre que a página ou os blocos colocados mudam (o DOM muda).
  useEffect(() => {
    if (!containerRef.current) return
    const draggable = new Draggable(containerRef.current, {
      itemSelector: '.bloco-arrastavel',
      eventData: (el) => JSON.parse(el.getAttribute('data-event') || '{}'),
    })
    return () => draggable.destroy()
  }, [blocosColocados])

  const cursos = Array.from(new Map(ucs.map(u => [u.curso.id, u.curso])).values())

  const blocoKey = (uc: UC, turma: Turma) => `${uc.id}-${turma.id}`

  const todosBlocos = ucs.flatMap(uc =>
    turmas
      .filter(t => t.curso.id === uc.curso.id && (t.ano - 1) * 2 + t.semestre === uc.semestre)
      .map(turma => ({ uc, turma }))
  )

  const blocosPorAlocar = todosBlocos.filter(b => !blocosColocados.has(blocoKey(b.uc, b.turma)))

  const feriadosEvents = useMemo(()=> feriados.map(f => ({
    start: `${f.data}T00:00:00`,
    end: `${f.data}T24:00:00`,
    display: 'background' as const,
    color: '#fecaca',
    extendedProps: { isFeriado: true, nome: f.nome },
  })),[feriados])

  const blocosGravadosEvents = useMemo(()=> blocosGravados.map(b => ({
    start: `${b.data.split('T')[0]}T${b.horaInicio}`,
    end:`${b.data.split('T')[0]}T${b.horaFim}`,
    extendedProps: {blocoId: b.id, ucId: b.uc.id, ucNome: b.uc.nome, turmaId: b.turma.id, turmaNome: b.turma.nome, docente: b.docente.nome, sala: b.sala.nome}
  })),[blocosGravados])
  
  const irParaAnterior = () => calendarRef.current?.getApi().prev()
  const irParaProximo = () => calendarRef.current?.getApi().next()
  const irParaHoje = () => calendarRef.current?.getApi().today()

  const navBtnStyle: React.CSSProperties = {
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '0.85rem',
    color: '#374151',
    cursor: 'pointer',
    fontWeight: 600,
    lineHeight: 1,
  }

  const vistaLabels: Record<Vista, string> = {
    turma: 'Turma',
    docente: 'Docente',
    sala: 'Sala',
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: '#f8fafc',
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr 280px',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}>

        {/* Coluna esquerda (Sidebar) */}
        <Sidebar />

        {/* Coluna Central (Filtros + Grelha) */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          borderLeft: '1px solid #e2e8f0',
          borderRight: '1px solid #e2e8f0',
        }}>

          {/* Barra de filtros fina */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderBottom: '1px solid #e2e8f0',
            background: '#fff',
            flexShrink: 0,
            fontFamily: 'system-ui, sans-serif',
          }}>
            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, marginRight: '2px' }}>
              Filtros:
            </span>
            {(['turma', 'docente', 'sala'] as Vista[]).map(v => (
              <button
                key={v}
                onClick={() => setVista(v)}
                style={{
                  background: vista === v ? '#16a34a' : '#f1f5f9',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: vista === v ? '#fff' : '#374151',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {vistaLabels[v]}
              </button>
            ))}

            <div style={{ width: '1px', height: '18px', background: '#e2e8f0', margin: '0 4px' }} />

            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Curso:</span>
            <select
              value={filtroCurso}
              onChange={e => setFiltroCurso(e.target.value)}
              style={{
                background: '#f1f5f9',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                color: '#111',
                cursor: 'pointer',
              }}
            >
              <option value="">Todos</option>
              {cursos.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button onClick={irParaAnterior} style={navBtnStyle}>‹</button>
              <button onClick={irParaHoje} style={{ ...navBtnStyle, padding: '4px 10px', fontSize: '0.7rem' }}>Hoje</button>
              <button onClick={irParaProximo} style={navBtnStyle}>›</button>
              {semanaLabel && (
                <span style={{ fontSize: '0.72rem', color: '#64748b', marginLeft: '4px', whiteSpace: 'nowrap' }}>
                  {semanaLabel}
                </span>
              )}
            </div>
          </div>

          {/* Grelha horária */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 12px 12px' }}>
            <FullCalendar
              ref={calendarRef}
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={false}
              allDaySlot={false}
              events={[...feriadosEvents, ...blocosGravadosEvents]}
              datesSet={(info) => {
                const ano = info.start.getFullYear()
                if (ano !== anoAtual) setAnoAtual(ano)
                const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' }
                const inicio = info.start.toLocaleDateString('pt-PT', opts)
                const fim = new Date(info.end.getTime() - 86400000).toLocaleDateString('pt-PT', opts)
                setSemanaLabel(`${inicio} – ${fim}`)
              }}
              slotMinTime="08:00:00"
              slotMaxTime="24:00:00"
              slotDuration="00:30:00"
              slotLabelInterval="00:30:00"
              slotLabelContent={(slotInfo) => {
                const date = slotInfo.date
                const hora = date.getHours()
                const minuto = date.getMinutes()
                const fimMinuto = minuto + 30 >= 60 ? 0 : minuto + 30
                const fimHora = minuto + 30 >= 60 ? hora + 1 : hora
                const formatarHora = (h: number, m: number) => {
                  if (h == 24) return `00:00`
                  return `${h}:${String(m).padStart(2, '0')}`
                }
                return `${formatarHora(hora, minuto)} - ${formatarHora(fimHora, fimMinuto)}`
              }}
              slotLabelClassNames="hora-slot"
              expandRows={true}
              height="100%"
              locale="pt"
              firstDay={1}
              dayHeaderFormat={{ weekday: larguraJanela < 1000 ? 'short' : 'long' }}
              dayHeaderContent={(arg) => {
                const d = arg.date
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                const feriado = feriados.find(f => f.data === dateStr)
                return (
                  <div style={{ textAlign: 'center' }}>
                    <div>{arg.text}</div>
                    {feriado && (
                      <div style={{ fontSize: '0.55rem', color: '#dc2626', fontWeight: 700, marginTop: '2px' }}>
                        {feriado.nome}
                      </div>
                    )}
                  </div>
                )
              }}
              eventAllow={(dropInfo) => {
                const d = dropInfo.start
                const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
                return !feriados.some(f => f.data === dateStr)
              }}
              hiddenDays={[0]}
              editable={true}
              droppable={true}
              eventOverlap={false}
              eventReceive={(info) => {
                
                const { ucId, turmaId , ucNome, turmaNome } = info.event.extendedProps
                setBlocosColocados(prev => new Set([...prev, `${ucId}-${turmaId}`]))
                
                const dataDrop = info.event.startStr.split('T')[0]
                const horaInicio = info.event.startStr.split('T')[1].slice(0, 5)
                const horaFim = info.event.endStr.split('T')[1].slice(0, 5)

                setDadosDrop({ ucId, turmaId, ucNome, turmaNome, dataDrop, horaInicio, horaFim })
                setDialogAberto(true)
                eventoPendenteRef.current = info.event

              }}

              eventDragStop={(info) => {
                if (!painelDireitoRef.current) return
                const rect = painelDireitoRef.current.getBoundingClientRect()
                const ev = info.jsEvent as MouseEvent
                if (
                  ev.clientX >= rect.left &&
                  ev.clientX <= rect.right &&
                  ev.clientY >= rect.top &&
                  ev.clientY <= rect.bottom
                ) {
                  const { ucId, turmaId, blocoId } = info.event.extendedProps
                  console.log('DragStop:', { ucId, turmaId, blocoId })
                  info.event.remove()
                  setBlocosColocados(prev => {
                    const next = new Set(prev)
                    next.delete(`${ucId}-${turmaId}`)
                    return next
                  })
                  if(blocoId){
                    fetch(`http://localhost:3000/blocos/${blocoId}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`},
                    })
                    setBlocosGravados(prev => prev.filter(b => b.id !== blocoId))
                  }
                }
              }}

              eventContent={(arg) => {
                if (arg.event.extendedProps.isFeriado) return <></>
                const { ucId, turmaId, ucNome, turmaNome, blocoId } = arg.event.extendedProps
                const remover = (e: React.MouseEvent) => {
                  e.stopPropagation()
                  arg.event.remove()
                  setBlocosColocados(prev => {
                    const next = new Set(prev)
                    next.delete(`${ucId}-${turmaId}`)
                    return next
                  })
                  if(blocoId){
                    fetch(`http://localhost:3000/blocos/${blocoId}`, {
                      method: 'DELETE',
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    })
                    setBlocosGravados(prev => prev.filter(b => b.id !== blocoId))
                  }
                }
                return (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '4px 7px',
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                    fontFamily: 'system-ui, sans-serif',
                  }}>
                    {/* Linha superior: horário + botão remover */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px' }}>
                      <span style={{
                        fontSize: '0.62rem',
                        color: 'rgba(255,255,255,0.8)',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                        whiteSpace: 'nowrap',
                      }}>
                        {arg.timeText}
                      </span>
                      <button
                        title="Devolver ao painel"
                        onClick={remover}
                        style={{
                          background: 'rgba(255,255,255,0.15)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          borderRadius: '4px',
                          color: '#fff',
                          cursor: 'pointer',
                          fontSize: '0.58rem',
                          padding: '1px 5px',
                          lineHeight: 1.4,
                          fontFamily: 'inherit',
                          flexShrink: 0,
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Nome da UC — centrado verticalmente entre o topo e a pill */}
                    <div style={{
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      color: '#fff',
                      lineHeight: 1.25,
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      textAlign: 'center',
                    }}>
                      {ucNome}
                    </div>

                    {/* Turma — alinhada ao fundo */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <span style={{
                        background: 'rgba(255,255,255,0.15)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        borderRadius: '20px',
                        padding: '1px 7px',
                        fontSize: '0.62rem',
                        color: '#fff',
                        fontWeight: 600,
                        letterSpacing: '0.03em',
                      }}>
                        {turmaNome}
                      </span>
                    </div>
                  </div>
                )
              }}
              eventColor="#16a34a"
            />

            {dialogAberto && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}>
                {dadosDrop && (
                  <div style={{
                    background: '#fff',
                    padding: '20px',
                    borderRadius: '8px',
                    fontFamily: 'system-ui, sans-serif',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  }}>
                    <p>UC: {dadosDrop.ucNome}</p>
                    <p>Turma: {dadosDrop.turmaNome}</p>
                    <p>Data: {dadosDrop.dataDrop}</p>
                     
                    <select style={{ marginRight: '2px'}} value={tipologiaEscolhida} onChange={e => setTipologiaEscolhida(e.target.value)}>
                      <option value="">Selecione a tipologia</option>
                      <option value="Teórica">Teórica</option>
                      <option value="Prática">Prática Laboratorial</option>
                      <option value="Prática">Teórico-Prática</option>
                      <option value="Prática">Seminário</option>
                      <option value="Prática">Trabalho de Campo</option>
                      <option value="Prática">Orientação Tutorial</option>
                      <option value="Prática">Estágio</option>
                      <option value="Prática">Outras</option>
                      <option value="Prática">Contacto</option>
                    </select>

                    <select style={{ marginRight: '2px' }} value={docenteEscolhido} onChange={e => setDocenteEscolhido(e.target.value)}>
                      <option value="">Selecione o docente</option>
                      {docentes.map(d => (
                        <option key={d.id} value={d.id}>{d.nome}</option>
                      ))}
                    </select>

                    <select style={{ marginRight: '15px' }} value={salaEscolhida} onChange={e => setSalaEscolhida(e.target.value)}>
                      <option value="">Selecione a sala</option>
                      {salas.map(s => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                      ))}
                    </select>

                    <button style={{ marginRight: '15px', fontFamily: 'system-ui, sans-serif' , padding: '4px 4px'}} onClick={async () => {
                      if (!dadosDrop) return
                      await fetch('http://localhost:3000/blocos', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                          ucId: dadosDrop.ucId,
                          turmaId: dadosDrop.turmaId,
                          tipologia: tipologiaEscolhida,
                          docenteId: Number(docenteEscolhido),
                          salaId: Number(salaEscolhida),
                          data: dadosDrop.dataDrop,
                          horaInicio: dadosDrop.horaInicio,
                          horaFim: dadosDrop.horaFim,
                        }),
                      })
                      eventoPendenteRef.current?.remove()
                      await fetchBlocos()
                      setDialogAberto(false)
                    }}>
                      Confirmar
                    </button>
                    <button style={{ fontFamily: 'system-ui, sans-serif', padding: '4px 4px' }} onClick={() => {
                      eventoPendenteRef.current?.remove()
                      if (dadosDrop) {
                        setBlocosColocados(prev => {
                          const next = new Set(prev)
                          next.delete(`${dadosDrop.ucId}-${dadosDrop.turmaId}`)
                          return next
                        })
                      }
                      setDialogAberto(false)
                    }}>
                      Cancelar
                    </button>

                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Coluna da direita (Blocos por alocar) */}
        <div ref={painelDireitoRef} style={{
          display: 'flex',
          flexDirection: 'column',
          borderLeft: '1px solid #e2e8f0',
          background: '#f1f5f9',
          minHeight: 0,
          overflow: 'hidden',
        }}>
          {/* Cabeçalho fixo */}
          <div style={{
            padding: '16px 16px 12px',
            borderBottom: '1px solid #e2e8f0',
            flexShrink: 0,
          }}>
            <h3 style={{
              color: '#111',
              fontSize: '0.9rem',
              fontWeight: 600,
              fontFamily: 'system-ui, sans-serif',
              margin: 0,
            }}>
              Blocos por alocar
              {blocosPorAlocar.length > 0 && (
                <span style={{
                  marginLeft: '8px',
                  background: '#16a34a',
                  color: '#fff',
                  borderRadius: '10px',
                  padding: '1px 7px',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  {blocosPorAlocar.length}
                </span>
              )}
            </h3>
          </div>

          {/* Lista de blocos — ref para o Draggable */}
          <div ref={containerRef} style={{ padding: '12px', flex: 1, minHeight: 0, overflow: 'auto' }}>
            {blocosPorAlocar.length === 0 ? (
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                textAlign: 'center',
                marginTop: '24px',
                fontFamily: 'system-ui, sans-serif',
              }}>
                {todosBlocos.length === 0
                  ? 'Importe um ficheiro Excel na página de Importação para gerar os blocos'
                  : 'Todos os blocos foram alocados'}
              </p>
            ) : (
              blocosPorAlocar
                .map((bloco) => {
                  const duracaoHoras = Math.max(1, Math.round(bloco.uc.horasContacto / 14))
                  const dataEvent = JSON.stringify({
                    title: bloco.uc.nome,
                    duration: `${String(duracaoHoras).padStart(2, '0')}:00:00`,
                    color: '#16a34a',
                    // extendedProps são propriedades adicionais que podemos associar ao evento, para depois as usarmos no eventContent ou noutros callbacks do FullCalendar.
                    extendedProps: {
                      ucId: bloco.uc.id,
                      turmaId: bloco.turma.id,
                      ucNome: bloco.uc.nome,
                      turmaNome: bloco.turma.nome,
                      codigo: bloco.uc.codigo,
                    },
                  })
                  return (
                    <div
                      key={blocoKey(bloco.uc, bloco.turma)}
                      className="bloco-arrastavel"
                      data-event={dataEvent}
                      style={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderLeft: '3px solid #16a34a',
                        borderRadius: '6px',
                        padding: '10px 12px',
                        marginBottom: '8px',
                        cursor: 'grab',
                        fontFamily: 'system-ui, sans-serif',
                        userSelect: 'none',
                      }}
                    >
                      <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#111', marginBottom: '4px' }}>
                        {bloco.uc.nome}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {bloco.uc.codigo} · {duracaoHoras}h/semana
                      </div>
                      <div style={{
                        marginTop: '6px',
                        display: 'inline-block',
                        background: '#dcfce7',
                        color: '#15803d',
                        borderRadius: '4px',
                        padding: '2px 6px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                      }}>
                        {bloco.turma.nome}
                      </div>
                    </div>
                  )
                })
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
