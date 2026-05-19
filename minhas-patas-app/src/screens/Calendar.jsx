import { useState } from 'react';
import { T, FONT_BODY, FONT_DISPLAY } from '../theme.js';
import { useNav } from '../components/NavContext.jsx';
import { usePet } from '../components/PetContext.jsx';
import { Icon, I, Card, EmojiCircle, IconBtn, Eyebrow, Display, BottomNav } from '../components/Shared.jsx';

const WEEK    = ['D','S','T','Q','Q','S','S'];
const MONTHS  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho',
                 'Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getStartDow(year, month) {
  return new Date(year, month, 1).getDay();
}

// Build event map from real pet data (medications → daily, consultations, vaccines)
function buildEventMap(medications, consultations, vaccines, year, month) {
  const map = {};
  const addEvent = (day, ev) => {
    if (!map[day]) map[day] = [];
    map[day].push(ev);
  };
  // Medications: show on every day of the month (simplified)
  medications.filter(m => m.on !== false).forEach(m => {
    const days = getDaysInMonth(year, month);
    for (let d = 1; d <= days; d++) {
      addEvent(d, { emoji: m.emoji || '💊', tint: T.tintLavender, label: m.name, type: 'med', data: m });
    }
  });
  // Consultations: parse date dd/mm/yyyy
  consultations.forEach(c => {
    if (!c.date) return;
    const parts = c.date.split('/');
    if (parts.length < 3) return;
    const cMonth = parseInt(parts[1]) - 1;
    const cYear  = parseInt(parts[2]);
    const cDay   = parseInt(parts[0]);
    if (cMonth === month && cYear === year) {
      addEvent(cDay, { emoji:'🩺', tint: T.tintRose, label: c.vet || 'Consulta', type:'consult', data: c });
    }
  });
  // Vaccines: parse date
  vaccines.forEach(v => {
    if (!v.date) return;
    const parts = v.date.split('/');
    if (parts.length < 3) return;
    const vMonth = parseInt(parts[1]) - 1;
    const vYear  = parseInt(parts[2]);
    const vDay   = parseInt(parts[0]);
    if (vMonth === month && vYear === year) {
      addEvent(vDay, { emoji:'💉', tint: T.tintMint, label: v.name, type:'vaccine', data: v });
    }
  });
  return map;
}

function EventDetail({ ev, onClose }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'flex-end', zIndex:200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width:'100%', background:T.bg, borderRadius:'24px 24px 0 0',
        padding:'24px 20px 40px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:20 }}>
          <div style={{ width:52, height:52, borderRadius:16, background:ev.tint,
            display:'flex', alignItems:'center', justifyContent:'center', fontSize:26 }}>{ev.emoji}</div>
          <div>
            <div style={{ fontSize:17, fontWeight:700, color:T.ink }}>{ev.label}</div>
            <div style={{ fontSize:13, color:T.inkSoft, marginTop:2, textTransform:'capitalize' }}>{ev.type}</div>
          </div>
        </div>
        {ev.data && (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {ev.data.dose && (
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
                background:T.bgWash, borderRadius:14 }}>
                <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Dose</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>
                  {ev.data.dose}{ev.data.unit ? ` ${ev.data.unit}` : ''}
                </span>
              </div>
            )}
            {ev.data.freq && (
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
                background:T.bgWash, borderRadius:14 }}>
                <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Frequência</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{ev.data.freq}</span>
              </div>
            )}
            {ev.data.date && (
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
                background:T.bgWash, borderRadius:14 }}>
                <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Data</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{ev.data.date}</span>
              </div>
            )}
            {ev.data.vet && (
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 16px',
                background:T.bgWash, borderRadius:14 }}>
                <span style={{ fontSize:13, fontWeight:600, color:T.inkSoft }}>Veterinário</span>
                <span style={{ fontSize:13, fontWeight:700, color:T.ink }}>{ev.data.vet}</span>
              </div>
            )}
            {ev.data.notes && (
              <div style={{ background:T.bgWash, borderRadius:14, padding:'12px 16px' }}>
                <div style={{ fontSize:12, fontWeight:600, color:T.inkSoft, marginBottom:4 }}>Observações</div>
                <div style={{ fontSize:13, color:T.ink, lineHeight:1.5 }}>{ev.data.notes}</div>
              </div>
            )}
          </div>
        )}
        <button onClick={onClose} style={{ width:'100%', height:48, borderRadius:99, marginTop:20,
          background:T.surface, color:T.ink, border:'none',
          fontSize:14, fontWeight:600, fontFamily:FONT_BODY, cursor:'pointer' }}>
          Fechar
        </button>
      </div>
    </div>
  );
}

export default function Calendar() {
  const { back } = useNav();
  const { medications = [], consultations = [], vaccines = [] } = usePet();
  const today = new Date();
  const [year, setYear]         = useState(today.getFullYear());
  const [month, setMonth]       = useState(today.getMonth());
  const [selectedDay, setSelected] = useState(today.getDate());
  const [eventDetail, setEventDetail] = useState(null);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1);
    setSelected(1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1);
    setSelected(1);
  };

  const daysInMonth = getDaysInMonth(year, month);
  const startDow    = getStartDow(year, month);
  const events      = buildEventMap(medications, consultations, vaccines, year, month);

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const selectedEvents = events[selectedDay] || [];
  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const isToday = (d) => isCurrentMonth && d === today.getDate();

  // Group by period
  const morning   = selectedEvents.filter(e => e.type === 'med');
  const timed     = selectedEvents.filter(e => e.type !== 'med');

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', background:T.bg }}>
      <div style={{ padding:'4px 24px 0', display:'flex', alignItems:'center',
        justifyContent:'space-between', marginTop:8 }}>
        <IconBtn icon={I.chevL} onClick={back} className="btn-press" />
        <Eyebrow>calendário</Eyebrow>
        <div style={{ width:40 }} />
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 24px 24px' }}>
        {/* Month header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
          <div onClick={prevMonth} style={{ width:36, height:36, borderRadius:18,
            background:T.surface, display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', boxShadow:'0 1px 4px rgba(20,20,30,0.06)' }}>
            <Icon d={I.chevL} size={16} color={T.ink} stroke={2.5} />
          </div>
          <Display size={28} weight={400}>
            <span style={{ fontStyle:'italic' }}>{MONTHS[month]}</span> {year}
          </Display>
          <div onClick={nextMonth} style={{ width:36, height:36, borderRadius:18,
            background:T.surface, display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'pointer', boxShadow:'0 1px 4px rgba(20,20,30,0.06)' }}>
            <Icon d={I.chevR} size={16} color={T.ink} stroke={2.5} />
          </div>
        </div>

        {/* Weekday headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:8 }}>
          {WEEK.map((d,i) => (
            <div key={i} style={{ textAlign:'center', fontSize:11, fontWeight:700,
              color:T.inkMute, letterSpacing:0.8, padding:'4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px 0' }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const hasEv    = !!events[day];
            const isSel    = day === selectedDay;
            const isTod    = isToday(day);
            return (
              <div key={i} onClick={() => setSelected(day)} className="pressable"
                style={{ aspectRatio:'1', display:'flex', flexDirection:'column',
                  alignItems:'center', justifyContent:'center', borderRadius:12,
                  cursor:'pointer', position:'relative',
                  background: isSel ? T.ink : isTod ? T.brandSoft : 'transparent' }}>
                <span style={{ fontSize:15, fontWeight: isSel || isTod ? 700 : 500,
                  color: isSel ? '#fff' : isTod ? T.brand : T.ink }}>
                  {day}
                </span>
                {hasEv && !isSel && (
                  <div style={{ display:'flex', gap:2, marginTop:2 }}>
                    {(events[day] || []).slice(0,3).map((_,j) => (
                      <div key={j} style={{ width:4, height:4, borderRadius:'50%',
                        background: isTod ? T.brand : T.inkFaint }} />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected day events */}
        <div style={{ marginTop:28 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
            <Eyebrow>{selectedDay} de {MONTHS[month].toLowerCase()}</Eyebrow>
            {isToday(selectedDay) && (
              <span style={{ fontSize:11, fontWeight:700, padding:'3px 10px', borderRadius:99,
                background:T.brandSoft, color:T.brand }}>hoje</span>
            )}
          </div>

          {selectedEvents.length === 0 ? (
            <div style={{ textAlign:'center', padding:'32px 0', color:T.inkMute }}>
              <div style={{ fontSize:32 }}>✨</div>
              <div style={{ fontSize:14, fontWeight:600, marginTop:8, color:T.inkSoft }}>
                Dia livre! Aproveite.
              </div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {timed.length > 0 && (
                <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft,
                  letterSpacing:0.8, textTransform:'uppercase', marginBottom:4 }}>Agendamentos</div>
              )}
              {timed.map((ev, i) => (
                <Card key={i} pad={14} radius={18} className="pressable"
                  onClick={() => setEventDetail(ev)} style={{ cursor:'pointer',
                    display:'flex', alignItems:'center', gap:12 }}>
                  <EmojiCircle emoji={ev.emoji} size={38} tint={ev.tint} />
                  <span style={{ fontWeight:600, fontSize:14, color:T.ink, flex:1 }}>{ev.label}</span>
                  <Icon d={I.chevR} size={16} color={T.inkFaint} stroke={2} />
                </Card>
              ))}
              {morning.length > 0 && (
                <>
                  <div style={{ fontSize:12, fontWeight:700, color:T.inkSoft,
                    letterSpacing:0.8, textTransform:'uppercase', margin:'8px 0 4px' }}>Medicamentos</div>
                  {morning.map((ev, i) => (
                    <Card key={i} pad={14} radius={18} className="pressable"
                      onClick={() => setEventDetail(ev)} style={{ cursor:'pointer',
                        display:'flex', alignItems:'center', gap:12 }}>
                      <EmojiCircle emoji={ev.emoji} size={38} tint={ev.tint} />
                      <span style={{ fontWeight:600, fontSize:14, color:T.ink, flex:1 }}>{ev.label}</span>
                      <Icon d={I.chevR} size={16} color={T.inkFaint} stroke={2} />
                    </Card>
                  ))}
                </>
              )}
            </div>
          )}

          {/* Google Calendar connect */}
          <div style={{ marginTop:20, background:T.surface, borderRadius:16,
            overflow:'hidden', boxShadow:'0 2px 8px rgba(20,20,30,0.05)' }}>
            <div style={{ padding:'14px 16px', display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ fontSize:20 }}>📅</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:700, color:T.ink }}>Google Calendar</div>
                <div style={{ fontSize:12, color:T.inkSoft }}>Integração em breve</div>
              </div>
              <div style={{ padding:'4px 10px', borderRadius:99, background:T.tintCream,
                fontSize:11, fontWeight:700, color:T.tintCreamInk }}>Em breve</div>
            </div>
            <div style={{ margin:'0 16px 14px', padding:'12px 14px',
              background:T.bgWash, borderRadius:12 }}>
              <div style={{ fontSize:12, fontWeight:700, color:T.ink, marginBottom:6 }}>
                O que é necessário para ativar:
              </div>
              <div style={{ fontSize:11, color:T.inkSoft, lineHeight:1.7 }}>
                • Projeto no Google Cloud com Calendar API ativada{'\n'}
                • Credenciais OAuth 2.0 (client ID + secret){'\n'}
                • Autorização do usuário via fluxo OAuth{'\n'}
                • Armazenamento seguro do token de acesso
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav active="today" />
      {eventDetail && <EventDetail ev={eventDetail} onClose={() => setEventDetail(null)} />}
    </div>
  );
}
