// MinhasPatas v2 — Screens 5-6: Today / Pet Profile

// ── 05 · Today (Tiimo-style daily agenda) ──────────────────────
function V2Today() {
  const [events, setEvents] = React.useState([
    { s:'m', time:'07:00', emoji:'🥣', tint: T.tintCream,    title:'Café da manhã', sub:'Ração 80g',          done:true },
    { s:'m', time:'08:00', emoji:'💊', tint: T.tintLavender, title:'Apoquel 16mg',  sub:'1 comprimido',        done:true },
    { s:'a', time:'10:30', emoji:'🚶', tint: T.tintPeach,    title:'Passeio matinal', sub:'30 min · Parque',    done:false, late:true },
    { s:'a', time:'12:30', emoji:'🥗', tint: T.tintMint,     title:'Almoço da Leia',  sub:'Sachê de frango',    done:false },
    { s:'a', time:'15:00', emoji:'💊', tint: T.tintLavender, title:'Prednisolona 10mg', sub:'1 comp · após refeição', done:false },
    { s:'n', time:'18:00', emoji:'🦴', tint: T.tintPeach,    title:'Passeio da tarde', sub:'20 min',           done:false },
    { s:'n', time:'22:00', emoji:'🧴', tint: T.tintSky,      title:'Protetor hepático', sub:'2.5ml líquido',    done:false },
  ]);
  const toggle = (i) => setEvents(events.map((e,idx) => idx === i ? {...e, done: !e.done, late: e.done ? e.late : false} : e));
  const morning = events.map((e,i) => ({...e, i})).filter(e => e.s === 'm');
  const afternoon = events.map((e,i) => ({...e, i})).filter(e => e.s === 'a');
  const night = events.map((e,i) => ({...e, i})).filter(e => e.s === 'n');
  const total = events.length;
  const done = events.filter(e => e.done).length;

  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background: T.bg}}>
      {/* Top compact row */}
      <div style={{padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 8}}>
        <div style={{
          display:'flex', alignItems:'center', gap: 6,
          padding:'8px 14px', borderRadius: 99,
          background: T.surface, boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 4px 12px -6px rgba(20,20,30,0.10)',
          fontWeight: 700, fontSize: 13, color: T.ink,
        }}>
          🎉 {done}/{total}
        </div>
        <div style={{display:'flex', gap: 8}}>
          <IconButton icon={I2.more}/>
          <IconButton icon={I2.plus}/>
        </div>
      </div>

      {/* Date display */}
      <div style={{padding:'30px 24px 0', textAlign:'center', position:'relative'}}>
        <div style={{position:'absolute', left: 24, top: 38, color: T.inkFaint}}>
          <Icon2 d={I2.chevL} size={22} color={T.inkFaint} stroke={2}/>
        </div>
        <div style={{position:'absolute', right: 24, top: 38, color: T.inkFaint}}>
          <Icon2 d={I2.chevR} size={22} color={T.inkFaint} stroke={2}/>
        </div>
        <Display size={56} weight={400}>Segunda</Display>
        <div style={{fontSize: 16, color: T.inkSoft, marginTop: 6}}>14 de maio, 2026</div>
      </div>

      {/* Sections */}
      <div style={{flex:1, overflow:'auto', padding:'22px 24px 16px'}}>
        {/* Anytime placeholder */}
        <SectionPill icon="🕘" label="Em qualquer hora" count={0} tint={T.bgWash} ink={T.inkSoft}/>
        <div style={{
          marginTop: 10, marginBottom: 18,
          padding:'18px', borderRadius: 18,
          border: `1.5px dashed ${T.hairlineStrong}`,
          color: T.inkMute, fontSize: 14,
          display:'flex', alignItems:'center', justifyContent:'space-between',
        }}>
          <span>Qualquer hora cai bem</span>
          <Icon2 d={I2.plus} size={16} color={T.inkMute} stroke={2}/>
        </div>

        {/* Morning */}
        <SectionPill icon="🌅" label="Manhã" count={morning.length} tint={T.tintPeach} ink={T.tintPeachInk}/>
        <div style={{display:'flex', flexDirection:'column', gap: 8, margin:'12px 0 22px'}}>
          {morning.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)}/>)}
        </div>

        {/* Afternoon */}
        <SectionPill icon="☀️" label="Tarde" count={afternoon.length} tint={T.tintLavender} ink={T.tintLavenderInk}/>
        <div style={{display:'flex', flexDirection:'column', gap: 8, margin:'12px 0 22px'}}>
          {afternoon.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)}/>)}
        </div>

        {/* Night */}
        <SectionPill icon="🌙" label="Noite" count={night.length} tint={T.tintSky} ink={T.tintSkyInk}/>
        <div style={{display:'flex', flexDirection:'column', gap: 8, margin:'12px 0 0'}}>
          {night.map(e => <TaskRow key={e.i} {...e} onToggle={() => toggle(e.i)}/>)}
        </div>
      </div>

      <BottomNav2 active="today"/>
    </div>
  );
}
window.V2Today = V2Today;

function TaskRow({ time, emoji, tint, title, sub, done, late, onToggle }) {
  return (
    <Card2 pad={14} radius={20} style={{opacity: done ? 0.55 : 1}}>
      <div style={{display:'flex', alignItems:'center', gap: 14}}>
        <EmojiCircle emoji={emoji} size={42} tint={tint}/>
        <div style={{flex:1, minWidth:0}}>
          <div style={{display:'flex', alignItems:'center', gap:6, flexWrap:'wrap'}}>
            <span style={{
              fontWeight: 700, fontSize: 15, color: T.ink,
              textDecoration: done ? 'line-through' : 'none',
            }}>{title}</span>
            {late && !done && <span style={{
              fontSize: 10, fontWeight: 800, letterSpacing: 0.8, textTransform:'uppercase',
              padding:'3px 8px', borderRadius: 99, background: T.tintRose, color: T.tintRoseInk,
            }}>atrasado</span>}
          </div>
          <div style={{fontSize: 12, color: T.inkSoft, marginTop: 2}}>{time} · {sub}</div>
        </div>
        <CheckBubble done={done} onClick={onToggle}/>
      </div>
    </Card2>
  );
}
window.TaskRow = TaskRow;

// ── 06 · Pet Profile ───────────────────────────────────────────
function V2Pet() {
  const { nav, back } = useNavV2();
  const rows = [
    { label:'Histórico de saúde',      emoji:'❤️',  tint: T.tintRose,     meta:'12 registros',         to:'pet'  },
    { label:'Medicamentos ativos',     emoji:'💊',  tint: T.tintLavender, meta:'5 ativos', dot:true,   to:'meds' },
    { label:'Consultas',               emoji:'📅',  tint: T.tintSky,      meta:'Próxima · 22 mai',      to:'today'},
    { label:'Documentos',              emoji:'📁',  tint: T.tintCream,    meta:'8 arquivos',          to:'pet'  },
    { label:'Vacinas',                 emoji:'🛡️', tint: T.tintMint,     meta:'Em dia',              to:'pet'  },
    { label:'Diário & comportamento',  emoji:'📓',  tint: T.tintPeach,    meta:'3 notas esta semana', to:'pet'  },
  ];
  return (
    <div style={{height:'100%', display:'flex', flexDirection:'column', background: T.bg, position:'relative', overflow:'hidden'}}>
      <div style={{position:'absolute', top:0, left:0, right:0, height: 280,
        background: `radial-gradient(120% 80% at 50% -10%, ${T.brandSoft} 0%, ${T.bg} 75%)`}}/>

      <div style={{padding:'4px 24px 0', display:'flex', alignItems:'center', justifyContent:'space-between', marginTop: 8, position:'relative'}}>
        <IconButton icon={I2.chevL} onClick={back}/>
        <div style={{display:'flex', gap: 8}}>
          <IconButton icon={I2.bell}/>
          <IconButton icon={I2.more}/>
        </div>
      </div>

      <div style={{flex:1, overflow:'auto', padding:'16px 24px 24px', position:'relative'}}>
        <div style={{display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', marginTop: 8}}>
          <Mascot size={150}/>
          <Eyebrow style={{marginTop: 12}}>fêmea · castrada · SRD</Eyebrow>
          <Display size={52} weight={400} style={{marginTop: 6}}>
            <span style={{fontStyle:'italic'}}>Leia</span>
          </Display>

          {/* Stat chips */}
          <div style={{display:'flex', gap: 8, marginTop: 18}}>
            {[
              {l:'8',     u:'anos',   k:'idade'},
              {l:'12.3',  u:'kg',     k:'peso'},
              {l:'2018',  u:'',       k:'nascimento'},
            ].map((c,i)=>(
              <div key={i} style={{
                padding:'10px 16px', borderRadius: 16, background: T.surface,
                textAlign:'center', minWidth: 70,
                boxShadow:'0 1px 2px rgba(20,20,30,0.04), 0 6px 16px -10px rgba(20,20,30,0.10)',
              }}>
                <div style={{fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 500, color: T.ink, lineHeight: 1}}>
                  {c.l}<span style={{fontSize: 12, color: T.inkSoft, marginLeft: 2, fontFamily: FONT_BODY, fontWeight: 600}}>{c.u}</span>
                </div>
                <div style={{fontSize: 10, color: T.inkMute, fontWeight: 700, letterSpacing: 0.8, textTransform:'uppercase', marginTop: 4}}>{c.k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Section list */}
        <Card2 pad={0} radius={22} style={{marginTop: 26, overflow:'hidden'}}>
          {rows.map((r,i)=>(
            <div key={i} onClick={() => nav(r.to)} style={{
              display:'flex', alignItems:'center', gap: 14, padding:'14px 16px',
              borderBottom: i < rows.length - 1 ? `1px solid ${T.hairline}` : 'none',
              cursor:'pointer',
            }}>
              <EmojiCircle emoji={r.emoji} size={38} tint={r.tint}/>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:'flex', alignItems:'center', gap:6}}>
                  <span style={{fontWeight: 700, fontSize: 15, color: T.ink}}>{r.label}</span>
                  {r.dot && <span style={{width:6, height:6, borderRadius:'50%', background:T.brand, display:'inline-block'}}/>}
                </div>
                <div style={{fontSize: 12, color: T.inkSoft, marginTop: 2}}>{r.meta}</div>
              </div>
              <Icon2 d={I2.chevR} size={18} color={T.inkMute} stroke={2}/>
            </div>
          ))}
        </Card2>

        <button style={{
          marginTop: 14, width:'100%', height: 52, borderRadius: 99,
          background: T.surface, color: T.ink, border:'none',
          fontFamily: FONT_BODY, fontSize: 14, fontWeight: 600,
          display:'flex', alignItems:'center', justifyContent:'center', gap: 8, cursor:'pointer',
          boxShadow:'0 1px 2px rgba(20,20,30,0.04)',
        }}>
          <Icon2 d={I2.edit} size={16} color={T.ink} stroke={2}/>
          Editar perfil
        </button>
      </div>
      <BottomNav2 active="pet"/>
    </div>
  );
}
window.V2Pet = V2Pet;
