import { useEffect, useRef, useState } from 'react'
import Sidebar from "../components/Sidebar"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
<<<<<<< Updated upstream
import interactionPlugin from '@fullcalendar/interaction'
=======
import interactionPlugin, { Draggable } from '@fullcalendar/interaction'
import { useAuth } from '../hooks/useAuth'
>>>>>>> Stashed changes

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

type Vista = 'turma' | 'docente' | 'sala'

export default function HorarioPage() {
<<<<<<< Updated upstream
=======
  const { user } = useAuth()
  console.log('Utilizador autenticado:', user)

  const [larguraJanela, setLarguraJanela] = useState(window.innerWidth)
  const [ucs, setUcs] = useState<UC[]>([])
  const [turmas, setTurmas] = useState<Turma[]>([])
  const [pagina, setPagina] = useState(0)
  const [vista, setVista] = useState<Vista>('turma')
  const [filtroCurso, setFiltroCurso] = useState('')
  const [blocosColocados, setBlocosColocados] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const painelDireitoRef = useRef<HTMLDivElement>(null)
  const BLOCOS_POR_PAGINA = 6
  const token = localStorage.getItem('token')

  useEffect(() => {
    const handleResize = () => setLarguraJanela(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchDados = async () => {
      const [ucsRes, turmasRes] = await Promise.all([
        fetch('http://localhost:3000/ucs', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:3000/turmas', { headers: { Authorization: `Bearer ${token}` } }),
      ])
      setUcs(await ucsRes.json())
      setTurmas(await turmasRes.json())
    }
    fetchDados()
  }, [])

  // Inicializa o Draggable do FullCalendar no contentor dos blocos.
  // Re-inicializa sempre que a página ou os blocos colocados mudam (o DOM muda).
  useEffect(() => {
    if (!containerRef.current) return
    const draggable = new Draggable(containerRef.current, {
      itemSelector: '.bloco-arrastavel',
      eventData: (el) => JSON.parse(el.getAttribute('data-event') || '{}'),
    })
    return () => draggable.destroy()
  }, [pagina, blocosColocados])

  // Repõe a página se ficar fora dos limites após remover blocos
  useEffect(() => {
    const total = Math.ceil(blocosPorAlocar.length / BLOCOS_POR_PAGINA)
    if (pagina > 0 && pagina >= total) setPagina(total - 1)
  })

  const cursos = Array.from(new Map(ucs.map(u => [u.curso.id, u.curso])).values())

  const blocoKey = (uc: UC, turma: Turma) => `${uc.id}-${turma.id}`

  const todosBlocos = ucs.flatMap(uc =>
    turmas
      .filter(t => t.curso.id === uc.curso.id && (t.ano - 1) * 2 + t.semestre === uc.semestre)
      .map(turma => ({ uc, turma }))
  )

  const blocosPorAlocar = todosBlocos.filter(b => !blocosColocados.has(blocoKey(b.uc, b.turma)))

  const totalPaginas = Math.ceil(blocosPorAlocar.length / BLOCOS_POR_PAGINA)

  const vistaLabels: Record<Vista, string> = {
    turma: 'Turma',
    docente: 'Docente',
    sala: 'Sala',
  }

>>>>>>> Stashed changes
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
          </div>

          {/* Grelha horária */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '0 12px 12px' }}>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={false}
              allDaySlot={false}
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
              hiddenDays={[0]}
              editable={true}
              droppable={true}
              eventOverlap={false}
              eventReceive={(info) => {
                const { ucId, turmaId } = info.event.extendedProps
                setBlocosColocados(prev => new Set([...prev, `${ucId}-${turmaId}`]))
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
                  const { ucId, turmaId } = info.event.extendedProps
                  info.event.remove()
                  setBlocosColocados(prev => {
                    const next = new Set(prev)
                    next.delete(`${ucId}-${turmaId}`)
                    return next
                  })
                }
              }}
              eventContent={(arg) => {
                const { ucId, turmaId, ucNome, turmaNome } = arg.event.extendedProps
                const remover = (e: React.MouseEvent) => {
                  e.stopPropagation()
                  arg.event.remove()
                  setBlocosColocados(prev => {
                    const next = new Set(prev)
                    next.delete(`${ucId}-${turmaId}`)
                    return next
                  })
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

                    {/* Turma pill — alinhada ao fundo */}
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
          <div ref={containerRef} style={{ padding: '12px', flex: 1, minHeight: 0, overflow: 'hidden' }}>
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
                .slice(pagina * BLOCOS_POR_PAGINA, (pagina + 1) * BLOCOS_POR_PAGINA)
                .map((bloco) => {
                  const duracaoHoras = Math.max(1, Math.round(bloco.uc.horasContacto / 14))
                  const dataEvent = JSON.stringify({
                    title: bloco.uc.nome,
                    duration: `${String(duracaoHoras).padStart(2, '0')}:00:00`,
                    color: '#16a34a',
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

          {/* Navegação por páginas */}
          {blocosPorAlocar.length > 0 && (
            <div style={{
              borderTop: '1px solid #e2e8f0',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexShrink: 0,
              fontFamily: 'system-ui, sans-serif',
            }}>
              <button
                onClick={() => setPagina(p => p - 1)}
                disabled={pagina === 0}
                style={{
                  background: pagina === 0 ? '#e2e8f0' : '#16a34a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: pagina === 0 ? '#94a3b8' : '#fff',
                  fontSize: '0.85rem',
                  cursor: pagina === 0 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                ‹
              </button>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                {pagina + 1} / {totalPaginas}
              </span>
              <button
                onClick={() => setPagina(p => p + 1)}
                disabled={pagina >= totalPaginas - 1}
                style={{
                  background: pagina >= totalPaginas - 1 ? '#e2e8f0' : '#16a34a',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  color: pagina >= totalPaginas - 1 ? '#94a3b8' : '#fff',
                  fontSize: '0.85rem',
                  cursor: pagina >= totalPaginas - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                }}
              >
                ›
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
