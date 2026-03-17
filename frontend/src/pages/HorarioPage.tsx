import Sidebar from "../components/Sidebar"
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

export default function HorarioPage() {
  return (
    // Div principal que ocupa toda a altura disponível 
    <div style={{ 
      minHeight: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#f8fafc',
    }}>
      {/* Layout de 3 colunas: sidebar | grelha | painel de blocos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '180px 1fr 280px',
        flex: 1,
        minHeight: 0,
        overflow: 'hidden',
      }}>

        {/* Coluna esquerda (Sidebar - menu de navegação) */}
        <Sidebar />

        {/* Coluna Central (Grelha horária e filtros) */}
        <div style={{
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'auto',
          borderLeft: '1px solid #e2e8f0',
          borderRight: '1px solid #e2e8f0',
        }}>

          {/* Filtros */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '24px',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            flexShrink: 0,
          }}>
            {/* Dropdown para selecionar o curso a visualizar */}
            <select style={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#000',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}>
              <option>Selecionar Curso</option>
            </select>

            {/* Botões para alternar a vista entre turma, docente e sala */}
            {['Turma', 'Docente', 'Sala'].map(vista => (
              <button key={vista} style={{
                background: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '8px 16px',
                color: '#111',
                fontSize: '0.85rem',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}>
                {vista}
              </button>
            ))}
          </div>

          {/* Grelha horária semanal */}
          <div style={{ flex: 1, minHeight: 0, overflow: 'visible'}}>
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

                // Calcula a hora de fim do slot somando 30 minutos
                const fimMinuto = minuto + 30 >= 60 ? 0 : minuto + 30
                const fimHora = minuto + 30 >= 60 ? hora + 1 : hora

                // Formata a hora no formato H:mm, tratando a meia-noite como 00:00
                const formatarHora = (h: number, m: number) => {
                  if(h == 24) return `00:00`
                  return `${h}:${String(m).padStart(2, '0')}`
              }

                return `${formatarHora(hora, minuto)} - ${formatarHora(fimHora, fimMinuto)}`
                
              }}
              slotLabelClassNames="hora-slot"
              expandRows={true}
              height= "auto"
              locale="pt"
              firstDay={1}
              dayHeaderFormat={{ weekday: 'long' }}
              hiddenDays={[0]}
              editable={true}
              droppable={true}
              events={[]}
            />
          </div>
        </div>

        {/* Coluna da direita (painel com blocos importados por alocar) */}
        <div style={{
          padding: '24px',
          overflowY: 'auto',
          borderLeft: '1px solid #e2e8f0',
          background: '#f1f5f9',
        }}>
          <h3 style={{
            color: '#111',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '16px',
            fontFamily: 'system-ui, sans-serif', 
          }}>
            Blocos por alocar
          </h3>
        </div>

      </div>
    </div>
  )
}